// so para constar, não foi eu que fiz essa página

import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material'
import { grey, yellow } from '@mui/material/colors'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { NumericFormat } from 'react-number-format'
import { z } from 'zod'

import { AdminLayout } from '@/components/layouts/admin'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'

type Product = {
  id: string
  title: string
  image_url: string
  category: { id: string; name: string }
  subcategory: { id: string; name: string; category: string }
  recommended: boolean
  review_url: string
  specs: Record<string, string>
  reference_price: number
}

type Retailer = {
  id: string
  name: string
  html_url: string
}

type ProductRetailerRelation = {
  price: number
  available: boolean
  html_url: string
  dummy: string
  retailer: Retailer
  coupon: string
}

const productHandlerSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1, 'Insira algum título.'),
  imageUrl: z.string().url().min(1, 'Insira alguma imagem.'),
  categoryId: z.string().min(1, 'Categoria deve existir.'),
  subcategoryId: z.string(),
  specs: z
    .array(
      z.object({
        title: z.string().min(1, 'Título da especificação não nulo.'),
        value: z.string().min(1, 'Especificação não nula.'),
      }),
    )
    .min(1, 'Adicione ao menos 1 especificação.'),
  reviewUrl: z.string().optional(),
  referencePrice: z.number().min(1).optional(),
  recommended: z.boolean(),
  retailers: z
    .array(
      z.object({
        retailer: z.object({
          id: z.string(),
          name: z.string(),
          html_url: z.string(),
        }),
        html_url: z.string().url(),
        dummy: z.string().optional(),
        price: z.number().min(1, 'Preço deve ser maior que R$ 1.'),
      }),
    )
    .min(1, 'Adicione pelo menos 1 vendedor.'),
})

type productHandlerData = z.infer<typeof productHandlerSchema>

export default function ProductsDashboard({
  products,
  retailers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<productHandlerData>({
    resolver: zodResolver(productHandlerSchema),
    defaultValues: {
      reviewUrl: '',
      referencePrice: 1,
    },
  })

  const {
    fields: specsFields,
    append: specsAppend,
    remove: specsRemove,
  } = useFieldArray({
    control,
    name: 'specs',
  })

  const {
    fields: retailersFields,
    append: retailersAppend,
    remove: retailersRemove,
  } = useFieldArray({
    control,
    name: 'retailers',
  })

  const productOptions = products.map((product) => {
    return {
      id: product.id,
      img: product.image_url,
      label: product.title,
    }
  })

  const productInput = watch()

  const productIdInput = watch('productId')

  useEffect(() => {
    const product = products.find(
      (product) => product.id === productInput.productId,
    )
    async function setProductRetailers(productId: string) {
      try {
        const response = await api.get(`/products/${productId}/retailers/`)
        const productRetailers: {
          price: number
          html_url: string
          dummy: string
          retailer: { id: string; name: string; html_url: string }
        }[] = response.data
        const validProductRetailers = productRetailers.map(
          (productRetailer) => {
            if (!productRetailer.dummy) {
              productRetailer.dummy = ''
            }
            return productRetailer
          },
        )
        setValue('retailers', validProductRetailers)
      } catch (error) {
        console.log(error)
      }
    }
    if (product) {
      setValue('categoryId', product.category.id)
      try {
        setValue('subcategoryId', product.subcategory.id)
      } catch {}
      setValue('title', product.title)
      setValue('imageUrl', product.image_url)
      specsFields.map(() => specsRemove(-1))
      specsKeysFinder(product.id).forEach((key) => {
        addNewSpec(key, product.specs[key])
      })
      setValue('reviewUrl', product.review_url ? product.review_url : ' ')
      setValue('referencePrice', product.reference_price)
      setValue('recommended', product.recommended)
      setProductRetailers(product.id)
    }
  }, [productIdInput, setValue])

  const { categories } = useCategory()

  function specsKeysFinder(product_id: string) {
    const product = products.find((product) => product.id === product_id)
    const specsKeys = product?.specs ? Object.keys(product.specs) : []

    return specsKeys
  }
  function addNewSpec(title: string, value: string) {
    specsAppend({
      title,
      value,
    })
  }
  function addNewRetailer(
    retailer: { id: string; name: string; html_url: string } = {
      id: '',
      html_url: '',
      name: '',
    },
    htmlUrl: string = '',
    price: number = 0,
    sku: string = '',
  ) {
    retailersAppend({
      retailer: {
        id: retailer.id,
        name: retailer.name,
        html_url: retailer.html_url,
      },
      dummy: sku,
      html_url: htmlUrl,
      price,
    })
  }

  function removeEmptyKeys(obj: { [key: string]: any }): {
    [key: string]: any
  } {
    const result: { [key: string]: any } = {}

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        result[key] = value
      }
    })

    return result
  }

  const router = useRouter()

  async function submitHandler(data: productHandlerData) {
    const specsObject = data.specs.reduce((acc, curr) => {
      return { ...acc, [curr.title]: curr.value }
    }, {})

    const productData = removeEmptyKeys({
      title: data.title,
      image_url: data.imageUrl,
      specs: specsObject,
      review_url: data.reviewUrl,
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      recommended: data.recommended,
      reference_price: data.referencePrice,
    })
    let productId: string | undefined
    if (data.productId) {
      productId = data.productId
      try {
        await api.patch(
          `/products/${productId}`,
          {
            ...productData,
          },
          {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Content-Type': 'application/json',
            },
          },
        )

        const res = await api.get(`/products/${productId}/retailers`)
        const productRetailers = res.data
        productRetailers.map(
          async (productRetailer: ProductRetailerRelation) => {
            await api.delete(
              `/products/${productId}/retailers/${productRetailer.retailer.id}`,
              {
                headers: {
                  'api-key': process.env.NEXT_PUBLIC_API_KEY,
                },
              },
            )
          },
        )
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log(productData)
      try {
        const res = await api.post(
          '/products/',
          {
            ...productData,
          },
          {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Content-Type': 'application/json',
            },
          },
        )
        productId = res.data.id
      } catch (err) {
        console.log(err)
      }
    }
    try {
      data.retailers.map(async (retailer) => {
        await api
          .post(
            `/products/${productId}/retailers/${retailer.retailer.id}`,
            {
              html_url: retailer.html_url,
              price: retailer.price,
              dummy: retailer.dummy || null,
            },
            {
              headers: {
                'api-key': process.env.NEXT_PUBLIC_API_KEY,
              },
            },
          )
          .then(() => {
            router.reload()
          })
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteProduct(productId: string | undefined) {
    if (productId) {
      try {
        await api
          .delete(`/products/${productId}`, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.reload())
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Gerenciador de Produtos | Bench Promos</title>
      </Head>
      <AdminLayout>
        <div className="w-max">
          <h2 className="text-2xl font-extrabold text-violet-600">
            ADICIONAR PRODUTO
          </h2>
          <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
        </div>

        <form
          id="product-form"
          className="max-md:flex flex-col grid grid-cols-2 gap-8 text-xl font-medium"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex flex-col col-span-2">
            <label>Produtos</label>
            <Controller
              name="productId"
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <Autocomplete
                  fullWidth
                  id="product"
                  options={productOptions}
                  autoHighlight
                  onChange={(_, value) =>
                    onChange(value ? value.id : undefined)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <Image
                        className="h-auto w-auto"
                        width={40}
                        height={1}
                        src={option.img}
                        alt=""
                      />
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <label>Título</label>
            <input
              type="text"
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-red-300">{errors.title.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Imagem</label>
            <input
              type="text"
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <span className="text-red-300">{errors.imageUrl.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Categoria</label>
            <select
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              id="category"
              {...register('categoryId')}
            >
              <option value=""></option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-red-300">{errors.categoryId.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Subcategoria</label>
            <select
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              id="subcategory"
              {...register('subcategoryId')}
            >
              {categories
                .find((category) => category.id === productInput.categoryId)
                ?.subcategories?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>Review</label>
            <input
              type="text"
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              {...register('reviewUrl')}
            />
            {errors.reviewUrl && (
              <span className="text-red-300">{errors.reviewUrl.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label>Preço de Referência</label>
            <Controller
              name="referencePrice"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericFormat
                  id="referencePrice"
                  displayType="input"
                  prefix="R$ "
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator="."
                  fixedDecimalScale={true}
                  allowNegative={false}
                  value={value! / 100}
                  className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                  onValueChange={({ floatValue }) => {
                    onChange({
                      target: {
                        name: 'referencePrice',
                        value: floatValue ? Math.round(floatValue * 100) : 0,
                      },
                    })
                    console.log(value)
                  }}
                />
              )}
            />
            {errors.referencePrice && (
              <span className="text-red-300">
                {errors.referencePrice.message}
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <label>Especificações</label>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => addNewSpec('', '')}
                className="rounded-full flex justify-center items-center bg-green-300 h-8 w-8 font-semibold hover:bg-green-500"
              >
                <FaPlus className="text-zinc-800" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (specsFields.length > 1) specsRemove(-1)
                }}
                className="rounded-full flex justify-center items-center bg-red-300 h-8 w-8 font-semibold hover:bg-red-500"
              >
                <FaMinus className="text-zinc-800" />
              </button>
            </div>
          </div>
          {specsFields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="max-md:flex flex-col grid grid-cols-2 gap-8 text-xl col-span-2"
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    {...register(`specs.${index}.title`)}
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    {...register(`specs.${index}.value`)}
                  />
                </div>
              </div>
            )
          })}
          {errors.specs && (
            <span className="text-red-300">{errors.specs.message}</span>
          )}

          <div className="flex flex-row items-center justify-between">
            <label className="flex">Recomendação</label>
            <Controller
              name="recommended"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  className="flex"
                  checked={field.value}
                  icon={<AiOutlineStar />}
                  checkedIcon={<AiFillStar />}
                  sx={{
                    '& svg': { fontSize: 20 },
                    color: grey[800],
                    '&.Mui-checked': {
                      color: yellow[600],
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="flex justify-between col-span-2">
            <div className="w-max">
              <h2 className="text-2xl font-extrabold text-violet-600">
                VINCULAR VAREJISTAS
              </h2>
              <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
            </div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => addNewRetailer()}
                className="rounded-full flex justify-center items-center bg-green-300 h-8 w-8 font-semibold hover:bg-green-500"
              >
                <FaPlus className="text-zinc-800" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (retailersFields.length > 1) retailersRemove(-1)
                }}
                className="rounded-full flex justify-center items-center bg-red-300 h-8 w-8 font-semibold hover:bg-red-500"
              >
                <FaMinus className="text-zinc-800" />
              </button>
            </div>
          </div>
          {retailersFields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="max-md:flex flex-col grid grid-cols-2 gap-8 text-xl col-span-2"
              >
                <div className="flex col-span-2">
                  <h4 className="text-2xl font-extrabold text-violet-600">
                    {index + 1}
                  </h4>
                </div>
                <div className="flex flex-col">
                  <label>Varejista</label>
                  <select
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    id="retailer"
                    {...register(`retailers.${index}.retailer.id`)}
                  >
                    <option value=""></option>
                    {retailers?.map((retailer) => (
                      <option key={retailer.id} value={retailer.id}>
                        {retailer.name}
                      </option>
                    ))}
                  </select>
                  {errors.retailers?.[index]?.retailer && (
                    <span className="text-red-300">
                      {errors.retailers[index]?.retailer?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label>Link</label>
                  <input
                    type="text"
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    {...register(`retailers.${index}.html_url`)}
                  />
                  {errors.retailers?.[index]?.html_url && (
                    <span className="text-red-300">
                      {errors.retailers[index]?.html_url?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <label>SKU </label>
                    <label className="text-base text-red-700">
                      *(Aliexpress, Casas Bahia, Ponto Frio, Fastshop)
                    </label>
                  </div>

                  <input
                    type="text"
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    {...register(`retailers.${index}.dummy`)}
                  />
                </div>

                <div className="flex flex-col">
                  <label>Preço</label>
                  <Controller
                    name={`retailers.${index}.price`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <NumericFormat
                        id="price"
                        displayType="input"
                        prefix="R$ "
                        decimalScale={2}
                        decimalSeparator=","
                        thousandSeparator="."
                        fixedDecimalScale={true}
                        allowNegative={false}
                        value={value / 100}
                        className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                        onValueChange={({ floatValue }) => {
                          onChange({
                            target: {
                              name: `retailers.${index}.price`,
                              value: floatValue
                                ? Math.round(floatValue * 100)
                                : 0,
                            },
                          })
                          console.log(value)
                        }}
                      />
                    )}
                  />
                  {errors.retailers?.[index]?.price && (
                    <span className="text-red-300">
                      {errors.retailers[index]?.price?.message}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {errors.retailers && (
            <span className="text-red-300">{errors.retailers.message}</span>
          )}
          <div className="flex flex-row col-span-2 justify-center gap-4">
            <Controller
              name="productId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button className="px-4 w-32 mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-red-500 hover:bg-red-400">
                      Excluir
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <AlertDialog.Title className="m-0 font-medium">
                        Excluir produto?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="mt-4 mb-5  leading-normal">
                        Essa ação não poderá ser desfeita. O produto será
                        completamente removido do site e do servidor.
                      </AlertDialog.Description>
                      <div className="flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                          <button className="bg-gray-100 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-8 items-center justify-center rounded px-2.5 font-medium leading-none outline-none focus:shadow-sm">
                            Cancelar
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button
                            onClick={() => deleteProduct(value)}
                            className="text-red-600 bg-red-200 hover:bg-red-300 focus:shadow-red-400 inline-flex h-8 items-center justify-center rounded px-2.5 font-semibold leading-none outline-none focus:shadow-sm"
                          >
                            Sim, excluir produto
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              )}
            />

            <button
              className=" px-4 w-32 mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
  retailers: Retailer[]
}> = async (ctx) => {
  const token = getCookie('bench-promos.token', ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const adminResponse = await api.get('/users/role/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const isAdmin = adminResponse.data

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const productsResponse = await api.get('/products')
  const retailersResponse = await api.get('/retailers')

  const products: Product[] = productsResponse.data
  const retailers: Retailer[] = retailersResponse.data
  return {
    props: {
      products,
      retailers,
    },
  }
}

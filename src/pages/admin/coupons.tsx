// so para constar, não foi eu que fiz essa página

import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@mui/material'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { NumericFormat } from 'react-number-format'
import { z } from 'zod'

import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { AdminLayout } from '@/components/layouts/admin'

type Retailer = {
  id: string
  name: string
}

type Coupons = {
  id: string
  available: boolean
  code: string
  discount: string
  minimum_spend: number
  comments: string
  description: string
  retailer: Retailer
}[]

const couponSchema = z.object({
  couponId: z.string().optional(),
  code: z.string().min(1),
  retailerId: z.string().min(1),
  discount: z
    .string()
    .min(1, 'Erro no desconto.')
    .transform((discount) => {
      return discount.replace(' ', '')
    })
    .nullable(),
  minimum_spend: z
    .number()
    .optional()
    .nullable()
    .transform((value) => {
      if (value) return Math.round(value / 100)
    }),
  comments: z.string().optional().nullable(),
  available: z.boolean(),
  category: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

type couponData = z.infer<typeof couponSchema>

export default function CouponsDashboard({
  coupons,
  retailers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<couponData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {},
  })

  const {
    fields: categoryFields,
    append: categoryAppend,
    remove: categoryRemove,
  } = useFieldArray({
    control,
    name: 'category',
  })

  const couponIdInput = watch('couponId')

  function restrictionsTypeConversion(restrictions: string) {
    type RestrictionsReceived = { category: string }
    type RestrictionsParsed = { category: string[] }
    const restrictionsParsed: RestrictionsParsed = { category: [] }
    if (restrictions) {
      const restrictionsReceived: RestrictionsReceived =
        JSON.parse(restrictions)

      if (restrictions.includes('category')) {
        restrictionsParsed.category = restrictionsReceived.category
          .replace(',', '')
          .split(' ')
      }
      const restrictionsObject = restrictionsParsed.category.map((value) => ({
        name: value,
      }))
      return restrictionsObject
    }

    return []
  }

  useEffect(() => {
    const coupon = coupons.find((coupon) => coupon.id === couponIdInput)
    if (coupon) {
      setValue('code', coupon.code)
      setValue('retailerId', coupon.retailer.id)
      setValue('discount', coupon.discount)
      setValue('minimum_spend', coupon.minimum_spend * 100)
      setValue('comments', coupon.comments)
      setValue('available', coupon.available)
      setValue('category', restrictionsTypeConversion(coupon.description))
    }
  }, [couponIdInput, setValue])

  const { categories } = useCategory()

  function addCategoryRestriction() {
    categoryAppend({ name: '' })
  }
  function removeCategoryRestriction() {
    categoryRemove(-1)
  }

  function restrictionTypeConvertionBack(restriction: { name: string }[]) {
    if (restriction) {
      const restrictionConverted = restriction
        .map((field) => field.name)
        .join(' ')

      const description =
        restrictionConverted !== ''
          ? `{"category": "${restrictionConverted}"}`
          : null
      return description
    }

    return null
  }

  const router = useRouter()

  async function submitCoupon(data: couponData) {
    const description = restrictionTypeConvertionBack(data.category)
    const couponPayload = {
      available: data.available,
      code: data.code,
      discount: data.discount,
      comments: data.comments,
      minimum_spend: data.minimum_spend,
      retailer_id: data.retailerId,
      description,
    }

    if (data.couponId) {
      try {
        await api
          .patch(
            `/coupons/${data.couponId}`,
            {
              ...couponPayload,
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
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        await api
          .post(
            '/coupons',
            {
              ...couponPayload,
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
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function deleteCoupon(couponId: string | undefined) {
    if (couponId) {
      try {
        await api
          .delete(`/coupons/${couponId}`, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => {
            router.reload()
          })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Gerenciador de Cupons | Bench Promos</title>
      </Head>
      <AdminLayout>
        <div className="w-max">
          <h2 className="text-2xl font-extrabold text-violet-600">
            ADICIONAR CUPOM
          </h2>
          <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
        </div>
        <form
          onSubmit={handleSubmit(submitCoupon)}
          className="max-md:flex flex-col grid grid-cols-2 gap-8 text-xl font-medium"
        >
          <fieldset className="flex flex-col">
            <label>Cupons</label>
            <select
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              id="coupons"
              {...register('couponId')}
              // {...register(`retailers.${index}.retailer.id`)}
            >
              <option value=""></option>
              {coupons?.map((coupon, index) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.code}
                </option>
              ))}
            </select>
            {errors.couponId && (
              <span className="text-red-300">{errors.couponId.message}</span>
            )}
          </fieldset>
          <fieldset className="flex flex-col">
            <label>Código</label>
            <input
              type="text"
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              {...register('code')}
            />
            {errors.code && (
              <span className="text-red-300">{errors.code.message}</span>
            )}
          </fieldset>
          <fieldset className="flex flex-col">
            <label>Varejista</label>
            <select
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              id="retailer"
              {...register('retailerId')}
              // {...register(`retailers.${index}.retailer.id`)}
            >
              <option value=""></option>
              {retailers?.map((retailer) => (
                <option key={retailer.id} value={retailer.id}>
                  {retailer.name}
                </option>
              ))}
            </select>
            {errors.retailerId && (
              <span className="text-red-300">{errors.retailerId.message}</span>
            )}
          </fieldset>

          <fieldset className="flex flex-col">
            <label>Desconto</label>
            <input
              type="text"
              className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
              {...register('discount')}
            />
            {errors.discount && (
              <span className="text-red-300">{errors.discount.message}</span>
            )}
          </fieldset>
          <fieldset className="flex flex-col">
            <label>Valor mínimo</label>
            <Controller
              name="minimum_spend"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericFormat
                  id="minimum_spend"
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
                  }}
                />
              )}
            />
            {errors.minimum_spend && (
              <span className="text-red-300">
                {errors.minimum_spend.message}
              </span>
            )}
          </fieldset>
          <fieldset className="flex flex-col">
            <label>Comentários</label>
            <textarea
              className="h-16 p-3.5 text-lg outline-none border border-black/20 shadow-md focus:ring-violet-500 focus:border-violet-500"
              id="comments"
              {...register('comments')}
            />
            {errors.comments && (
              <span className="text-red-300">{errors.comments.message}</span>
            )}
          </fieldset>
          <fieldset className="flex flex-row items-center justify-between">
            <label className="flex">Disponibilidade</label>
            <Controller
              name="available"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  className="flex"
                  checked={field.value}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 40 },
                  }}
                />
              )}
            />
            {errors.available && (
              <span className="text-red-300">{errors.available.message}</span>
            )}
          </fieldset>

          <div className="w-max col-span-2">
            <h2 className="text-2xl font-extrabold text-violet-600">
              RESTRIÇÕES
            </h2>
            <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
          </div>

          <div className="flex justify-between col-span-2">
            <label>Categorias</label>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => addCategoryRestriction()}
                className="rounded-full flex justify-center items-center bg-green-300 h-8 w-8 font-semibold hover:bg-green-500"
              >
                <FaPlus className="text-zinc-800" />
              </button>
              <button
                type="button"
                onClick={() => {
                  removeCategoryRestriction()
                }}
                className="rounded-full flex justify-center items-center bg-red-300 h-8 w-8 font-semibold hover:bg-red-500"
              >
                <FaMinus className="text-zinc-800" />
              </button>
            </div>
          </div>

          {categoryFields.map((field, index) => {
            return (
              <fieldset key={field.id}>
                <div className="flex flex-col">
                  <select
                    className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
                    {...register(`category.${index}.name`)}
                  >
                    <option value=""></option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            )
          })}
          {errors.category && (
            <span className="text-red-300">{errors.category.message}</span>
          )}

          <div className="flex flex-row col-span-2 justify-center gap-4">
            <Controller
              name="couponId"
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
                        Excluir cupom?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="mt-4 mb-5  leading-normal">
                        Essa ação não poderá ser desfeita. O cupoom será
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
                            onClick={() => deleteCoupon(value)}
                            className="text-red-600 bg-red-200 hover:bg-red-300 focus:shadow-red-400 inline-flex h-8 items-center justify-center rounded px-2.5 font-semibold leading-none outline-none focus:shadow-sm"
                          >
                            Sim, excluir cupom
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
  coupons: Coupons
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

  const response = await api.get('/users/role/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const isAdmin = response.data

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const resCoupons = await api.get('/coupons')
  const resRetailers = await api.get('/retailers')

  const coupons: Coupons = resCoupons.data
  const retailers: Retailer[] = resRetailers.data

  return {
    props: {
      coupons,
      retailers,
    },
  }
}

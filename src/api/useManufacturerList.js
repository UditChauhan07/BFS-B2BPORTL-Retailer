import { useAuth } from "../context/UserContext"
import { DestoryAuth, originAPi } from "../lib/store"
import { useFetch } from "./useFetch"

export const useManufacturerList = () => {
  const { user, isUserLoading } = useAuth()

  const payload = {
    accountId: user?.data?.accountId,
    key: user?.data?.x_access_token,
  }

  const { data, error, loading } = useFetch(
    originAPi + "/retailer/GQGpen0kmGHGPtx",
    payload
  )

  console.log({ data, error, loading })

  return data
}

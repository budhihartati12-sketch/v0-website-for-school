export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

export const getAdminUser = () => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("adminUser")
  return user ? JSON.parse(user) : null
}

export const logout = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("adminUser")
}

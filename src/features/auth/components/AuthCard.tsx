import React, { ReactNode } from "react"

const AuthCard = ({children} : {children: React.ReactNode}) => {
  return (
    <div className=" w-[90%] md:w-100 flex flex-col rounded-md shadow-2xl text-text-primary">
        {children}
    </div>
  )
}

export default AuthCard
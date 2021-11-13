import * as React from 'react'
import { Customer } from '../types'


type GlobalData = {
    customers: Customer[]
}

export const GlobalDataContext=  React.createContext({
    customers: []
})


const GlobalDataProvider: React.FC = ({ children }) => {
    return (
        <GlobalDataContext.Provider value={{customers:[]}}>
            {children}
        </GlobalDataContext.Provider>
    )
}


export default GlobalDataProvider;


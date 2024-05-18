import React, { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";

type AccountCode = {
    parent: number;
    child: number;
    grandchild: number;
}

const Form = (): JSX.Element => {

    const [code, setCode] = useState("")

    const [accounts, setAccounts] = useState([[[]]])
    const [accountCode, setAccountCode] = useState<AccountCode>({
        parent: 0,
        child: 0,
        grandchild: 0
    })

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")

    const inputIsValid = (parent: string, child: string, grandchild: string, rest: string): boolean =>
        Boolean(
            (parent && !Number.isNaN(Number(parent)) && Number(parent) <= 999) &&
            (child == undefined || (child != "" && !Number.isNaN(Number(child)) && Number(child) <= 999)) &&
            (grandchild == undefined || (grandchild != "" && !Number.isNaN(Number(grandchild)) && Number(child) <= 999)) &&
            (rest == undefined && rest != "") 
        )


    useEffect(() => {
        const [parent, child, grandchild, rest] = code.split(".")
        setTouched(true)
        if (!inputIsValid(parent, child, grandchild, rest) && touched) {
            setError("Invalid input")
            return
        }

        setError("")

        setAccountCode({
            parent: Number(parent),
            child: Number(child),
            grandchild: Number(grandchild)
        })



    }, [code])

    return (
        <>
            <>
                <Text>Conta</Text>
                <TextInput onChangeText={setCode} />
            </>
            <>
                <Text>{code}</Text>
                <Text>Parent - {accountCode.parent}</Text>
                <Text>Child - {accountCode.child}</Text>
                <Text>Grandchild - {accountCode.grandchild}</Text>
            </>
            <>
                <Text style={{ color: "red" }}>{error}</Text>
            </>
        </>
    )
}

export default Form;

import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { AccountAlreadyExistsError, AccountError, ParentDoesntExistsError } from "../error";

type AccountCode = Number[];

type Account = {
    id: string
    accounts: Account[]
}

const Form = (): JSX.Element => {

    const [code, setCode] = useState("")
    const [suggestedCode, setSuggestedCode] = useState()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountCode, setAccountCode] = useState<number[]>([])

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")

    const inputIsValid = (accountCode: number[]) =>
        accountCode.reduce<boolean>((prevValue, accountCodePart) =>
            Boolean(prevValue &&
                !Number.isNaN(Number(accountCodePart)) &&
                Number(accountCodePart) > 0
                && Number(accountCodePart) <= 999), true)



    useEffect(() => {
        let accountCode = code.split(".").map(Number)
        setTouched(true)
        setError("")

        if (!inputIsValid(accountCode) && touched) {
            setError("Invalid input")
            return
        }

        accountCode = accountCode.map(code => code - 1)
        setAccountCode(accountCode)
    }, [code])

    // Opposed to codeIsValid (see the pattern chage) this throws an error to be handled instead of a boolean since 
    // its responsible to test and identify the specifity of the error and not only if its valid or not. 
    const validateAccount = () => {
        const accountCodeDepth = accountCode.length

        // TODO merge both for loops
        for (let i = 1, currAccounts: Account[] = accounts; i < accountCodeDepth - 1; i++) {
            if (!currAccounts || (currAccounts && !currAccounts[accountCode[i]])) throw new ParentDoesntExistsError();
            currAccounts = currAccounts[accountCode[i]].accounts
        }
        for (let i = 0, currAccounts: Account[] = accounts; i < accountCodeDepth; i++) {
            if (i + 1 == accountCodeDepth)
                if (currAccounts[accountCode[i]])
                    throw new AccountAlreadyExistsError()
                else break
            else
                currAccounts = currAccounts[accountCode[i]].accounts
        }


        /* TODO
        Implement DataBase Full
        eg input: 999.999
        but 999.999.999 already exists
        */
    }

    const insertAccount = () => {
        validateAccount()
        const accountCodeDepth = accountCode.length

        for (let i = 0, currAccounts: Account[] | undefined = accounts;
            i < accountCodeDepth;
            i++
        ) {
            if (i == accountCodeDepth - 1) {
                currAccounts[accountCode[i]] = {
                    id: accountCode.join("."),
                    accounts: []
                }
            } else currAccounts = currAccounts[accountCode[i]].accounts
        }
        setAccounts([...accounts])
    }

    const addAccount = () => {
        try {
            insertAccount()
        } catch (err) {
            if (err instanceof ParentDoesntExistsError) setError("Conta pai nao existe")
            if (err instanceof AccountAlreadyExistsError) setError("Conta ja existe")
        }
    }

    const mapAccount = (acc: Account): any => (
        acc && [
            <Text key={acc.id}>{Number(acc.id) + 1}</Text>,
            acc.accounts?.map(mapAccount)
        ])


    return (
        <>
            <>
                <Text>Conta</Text>
                <TextInput onChangeText={setCode} style={{ borderColor: 'black', borderWidth: 3 }} />
                <Button title="Criar" onPress={addAccount} />
            </>
            <>
                <Text style={{ color: "red" }}>{error}</Text>
            </>
            <>{accounts.map(mapAccount)}</>
        </>
    )



}

export default Form;

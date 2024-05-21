import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { AccountAlreadyExistsError, ParentDoesntExistsError } from "../error";
import { Account } from "../../App";

type FormProps = {
    accounts: Account[]
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
}

const Form = ({accounts, setAccounts}: FormProps): JSX.Element => {

    const [code, setCode] = useState("")
    const [suggestedCode, setSuggestedCode] = useState("")

    const [accountCode, setAccountCode] = useState<number[]>([])

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")
    const [confirmMessage, setConfirmMessage] = useState("")

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
        setConfirmMessage("")

        if (!inputIsValid(accountCode) && touched) {
            setError("Invalid input")
            return
        }

        accountCode = accountCode.map(code => code - 1)
        setAccountCode(accountCode)
        setSuggestedCode("")
    }, [code])

    /* Manage stack (view is inverted)
        Pop and add 1   Pop and add 1
    0   |0              |0
    3   |3              |3
    5   |5              |6
    999 |1000           |
    999 
    */
    // When suggesting a code if the cliend presses 1.1 and the next available is 2.4 
    // but 2 has another type suggest the next one?
    const getSuggestedCode = (accounts: Account[], currDepth: number = 0, suggestedCodes: number[] = []): number[] => {
        if (!accounts?.length) {
            suggestedCodes.push(0)
            return suggestedCodes
        }

        if (currDepth === accountCode.length) {
            // Create function for accounts[accounts.length - 1].id.split(".").map(Number).at(-1) + 1)
            suggestedCodes.push(accounts[accounts.length - 1].id.split(".").map(Number).at(-1) + 1)
            return suggestedCodes
        } else {
            suggestedCodes.push(accountCode[currDepth])
        }
        let children = accounts[accountCode[currDepth]]?.accounts
        let newSuggestedCodes = getSuggestedCode(children, currDepth + 1, suggestedCodes)
        if (newSuggestedCodes.at(-1) === 999) {
            newSuggestedCodes.pop()
            newSuggestedCodes[newSuggestedCodes.length - 1] = accounts[accounts.length - 1].id.split(".").map(Number).at(-1) + 1
        }

        suggestedCodes.concat(newSuggestedCodes)

        return suggestedCodes
    }

    const updateSuggestedCode = () => {
        setSuggestedCode("")
        let suggestedCode = getSuggestedCode(accounts).join(".")
        setSuggestedCode(suggestedCode)
    }

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
            setConfirmMessage(`Conta ${code} criada`)
        } catch (err) {
            if (err instanceof ParentDoesntExistsError) setError("Conta pai nao existe")
            if (err instanceof AccountAlreadyExistsError) {
                updateSuggestedCode()
            }
        }
    }
        
    return (
        <>
            <>
                <Text>Conta</Text>
                <TextInput onChangeText={setCode} style={{ borderColor: 'black', borderWidth: 3 }} />
                <Button title="Criar" onPress={addAccount} />
            </>
            <>
                {suggestedCode && (
                    <>
                        <Text>Gostaria de criar a conta:</Text>
                        {/** Create button to fulfill input and create the account */ 
                        }
                        <Text>
                            {suggestedCode.split(".").map(m => Number(m) + 1).join(".")}
                        </Text>
                    </>
                )}
                <Text style={{ color: "red" }}>{error}</Text>
                <Text style={{ color: "green" }}>{confirmMessage}</Text>
            </>
        </>
    )
}

export default Form;

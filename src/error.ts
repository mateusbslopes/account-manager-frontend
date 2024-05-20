export class ParentDoesntExistsError extends Error {
    name = 'PARENT_DOESNT_EXISTS'
}

export class AccountAlreadyExistsError extends Error {
    name = 'ACCOUNT_ALREADY_EXISTS'
}

export class DatabaseFullError extends Error {
    name = 'DATABASE_FULL'
}
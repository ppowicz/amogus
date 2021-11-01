export enum UserRole {
    Customer,
    Admin
}

export default interface IUser {
    id: number,
    email: string,
    verified: boolean,
    role: UserRole
}
export default async function checkAdmin(userId, prisma){
    const user = await prisma.query.user({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new Error("Account not found!")
    }
    if (user.role !== "Admin") {
        throw new Error("You don't have required privileges!")
    }
    return true;
}

export async function getUserRole(userId, prisma){
    const user = await prisma.query.user({
        where: {
            id: userId
        }
    });
    return user.role;
}
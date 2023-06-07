// export class ApiError extends Error {
//     constructor(status: number, message: string){
//         super()
//         this.status = status
//         this.message = message
//     }

//     static badRequest(res,errorMessage){
//         return res.error(400,{
//             message: errorMessage.message,
//             friendlyMsg: errorMessage.friendlyMsg
//         })
//     }
//     static unauthorized(res,errorMessage,friendlyMsg){
//         return res.error(401,{
//             message: errorMessage.message,
//             friendlyMsg: errorMessage.friendlyMsg
//         })
//     }
//     static forbidden(res,errorMessage,friendlyMsg){
//         return res.error(403,{
//             message: errorMessage.message,
//             friendlyMsg: errorMessage.friendlyMsg
//         })
//     }
//     static notFound(res,errorMessage,friendlyMsg){
//         return res.error(404,{
//             message: errorMessage.message,
//             friendlyMsg: errorMessage.friendlyMsg
//         })
//     }
//     static internal(res,errorMessage,friendlyMsg){
//         console.log(errorMessage.message);
//         return res.error(500,{
//             friendlyMsg: errorMessage.friendlyMsg
//         })
//     }
// }
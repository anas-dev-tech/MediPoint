import authAPI from "./authAPI";


export const getChatBotSessionId = async () =>{
    const response = await authAPI.get('/chat/')
    console.log(response.data.chatbot_session_id)
    return response.data
}

export const sendChatBotMessage = async (chatBotSessionId, message)=>{
    console.log(chatBotSessionId)
    const response = await authAPI.post(`/chat/${chatBotSessionId}/`, {message})
    return response.data
} 

export const endChatBotSession = async (chatBotSessionId) =>{
    const response = await authAPI.post(`/chat/${chatBotSessionId}/end/`)
    return response.status  // it should be 204
}
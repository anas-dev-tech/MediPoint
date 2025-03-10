import authAPI from './authAPI'


export const getSchedules = async()=>{
    const {data, status} = await authAPI.get('/schedules/')
    return {data, success: status === 200} 
}
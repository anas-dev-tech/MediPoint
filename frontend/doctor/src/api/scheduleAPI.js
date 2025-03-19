import authAPI from './authAPI'


export const getSchedules = async (pageNumber = 1) => {
    const { data, status } = await authAPI.get(`/schedules/?page=${pageNumber}&page_size=8`)
    console.log(data)
    return { data: data, success: status === 200 }
}
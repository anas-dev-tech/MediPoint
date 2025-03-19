import { getSchedules } from "../api/scheduleAPI";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import toast from 'react-hot-toast';
import { MoreHorizontal } from "lucide-react";
import authAPI from "../api/authAPI";
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
import { BeatLoader } from "react-spinners";
import { Card } from "@/components/ui/card";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

const Schedule = () => {
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm();
    const [schedules, setSchedules] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [open, setOpen] = useState(false);
    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")
    const [current, setCurrent] = useState(1)
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false)

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleTraverseAppointments = async (pageNumber) => {
        if (pageNumber === -1) {
            return
        }
        await fetchSchedules(pageNumber);
    }

    const fetchSchedules = async (pageNumber = 1) => {
        try {
            setIsLoadingSchedules(true)
            const { data } = await getSchedules(pageNumber);
            setSchedules(data.results);
            setCurrent(data.current)
            setPrev(data.previous)
            setNext(data.next)
            setIsLoadingSchedules(false)
        } catch (error) {
            console.error("Error fetching schedules", error);
            setIsLoadingSchedules(false)
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingId) {
                await authAPI.put(`/schedules/${editingId}/`, data);
                toast.success("Schedule updated successfully");
            } else {
                await authAPI.post("/schedules/", data);
                toast.success("Schedule created successfully");
            }
            fetchSchedules();
            reset();
            setEditingId(null);
            setOpen(false);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach((field) => {
                    if (field === "message") {
                        toast.error(errorData[field]);
                    } else {
                        setError(field, { type: "manual", message: errorData[field][0] });
                    }
                });
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleEdit = (schedule) => {
        setEditingId(schedule.id);
        setValue("day", schedule.day);
        setValue("start_time", schedule.start_time);
        setValue("end_time", schedule.end_time);
        setValue("max_patients", schedule.max_patients);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await authAPI.delete(`/schedules/${id}/`);
            toast.success("Schedule deleted successfully");
            fetchSchedules();
        } catch (error) {
            console.error("Error deleting schedule", error);
            toast.error("Failed to delete schedule");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-5">
            <h2 className="text-2xl font-bold mb-4">Manage Schedules</h2>
            <Button onClick={() => { reset(); setEditingId(null); setOpen(true); }}>Create Schedule</Button>
            <Card className={`overflow-hidden shadow-sm mt-4`}>
                <Table>
                    <TableHeader>
                        <TableRow >
                            <TableHead className={`ps-5`}>#</TableHead>

                            <TableHead>Day</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Max Patients</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoadingSchedules
                        ? <TableBody>
                            <TableRow >
                                <TableCell colSpan={7} className="text-center">
                                    <div className="h-50 flex justify-center items-center w-full">
                                        <BeatLoader color="green" size={10} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>

                        : <TableBody>
                            {schedules.map((schedule, index) => (
                                <TableRow key={schedule.id}>
                                    <TableCell className={`ps-5`}>{index + 1}</TableCell>

                                    <TableCell>{schedule.day}</TableCell>
                                    <TableCell>{formatTime(schedule.start_time)}</TableCell>
                                    <TableCell>{formatTime(schedule.end_time)}</TableCell>
                                    <TableCell>{schedule.max_patients}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEdit(schedule)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(schedule.id)} className="text-red-600">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    }
                </Table>
                {
                    next !== prev &&
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => handleTraverseAppointments(prev)} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">{current}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handleTraverseAppointments(next)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                }
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Schedule" : "Create Schedule"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <select {...register("day")} className="w-full border p-2 rounded">
                            <option value="" disabled>Select a day</option>
                            {daysOfWeek.map(day => (
                                <option key={day} value={day.slice(0, 3).toUpperCase()}>{day}</option>
                            ))}
                        </select>
                        {errors.day && <p className="text-red-600">{errors.day.message}</p>}
                        <Input type="time" {...register("start_time")} />
                        {errors.start_time && <p className="text-red-600">{errors.start_time.message}</p>}
                        <Input type="time" {...register("end_time")} />
                        {errors.end_time && <p className="text-red-600">{errors.end_time.message}</p>}
                        <Input type="number" {...register("max_patients")} placeholder="Max Patients" />
                        {errors.max_patients && <p className="text-red-600">{errors.max_patients.message}</p>}
                        <DialogFooter>
                            <Button type="submit">{editingId ? "Update" : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Schedule;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth";
import { getAppointments, cancelAppointment, completeAppointment } from "../api/appointmentAPI";
import { extractDateAndTime } from "../utils/datetimeFormat";
import { assets } from "../assets/assets";
import { BarLoader, BeatLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const Appointments = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)

  const [prev, setPrev] = useState("")
  const [next, setNext] = useState("")
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    let isMounted = true; // Add a flag to track if the component is still mounted

    const loadAppointments = async () => {
      try {
        setIsLoadingAppointments(true)
        if (isAuthenticated) {
          const { results, current, previous, next } = await getAppointments();
          if (isMounted) { // Only update state if the component is still mounted
            setAppointments(results);
            setPrev(previous)
            setCurrent(current)
            setNext(next)
          }
        }
        setIsLoadingAppointments(false)
      } catch (error) {
        console.error("Error loading appointments:", error); // Log the error for debugging
        toast.error(`There is something wrong: ${error.message}`); // Display the error message
        setIsLoadingAppointments(false)
      }
      setIsLoadingAppointments(false)
    };

    loadAppointments();

    return () => {
      isMounted = false; // Cleanup function to set the flag to false when the component unmounts
    };
  }, [isAuthenticated, getAppointments, setAppointments]); // Add dependencies if necessary

  const handleTraverseAppointments = async (pageNumber) => {
    if (pageNumber === -1) {
      return
    }
    setIsLoadingAppointments(true)
    const { next, current , previous, results } = await getAppointments(pageNumber)
    setAppointments(results)
    setNext(next)
    setPrev(previous)
    setCurrent(current)
    setIsLoadingAppointments(false)
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsLoadingCancel(true)
      const { data, success } = await cancelAppointment(appointmentId);
      if (success) {
        toast.success(data.detail);
        getAppointments().then(setAppointments).catch(console.error);
        setIsLoadingCancel(false)
      } else {
        toast.error(data);
        setIsLoadingCancel(false)
      }
    } catch (error) {
      console.error(error);
      setIsLoadingCancel(false)
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    setIsLoadingComplete(true)
    const { data, success } = await completeAppointment(appointmentId);
    if (success) {
      getAppointments().then(setAppointments).catch(console.error);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setIsLoadingComplete(false)
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <h2 className="text-lg font-medium mb-3">All Appointments</h2>
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`ps-5`}>#</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Fees</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingAppointments
            ? <TableBody>
              <TableRow >
                <TableCell colSpan={7} className="text-center">
                  <div className="h-50 flex justify-center items-center w-full">
                    <BeatLoader  color="green" size={10}/>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
            : <TableBody>
              {appointments.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50 ">
                  <TableCell className={`ps-5`}>{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={item.patient.user?.image || assets.profile_placeholder} alt="Patient Image" />
                    </Avatar>
                    {item.patient.user?.full_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status === "P" ? "Online" : "Cash"}</Badge>
                  </TableCell>
                  <TableCell>{calculateAge(item.patient?.user?.dob)}</TableCell>
                  <TableCell>
                    {extractDateAndTime(item.datetime).date}, {extractDateAndTime(item.datetime).time}
                  </TableCell>
                  <TableCell>${item.fees}</TableCell>
                  <TableCell>
                    {item.status === "C" ? (
                      <Badge variant="destructive">Canceled</Badge>
                    ) : item.status === "D" ? (
                      <Badge variant="success">Completed</Badge>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant='secondary' size="icon" onClick={() => handleCancelAppointment(item.id)}>
                          {isLoadingCancel
                            ? <BarLoader color="red" />
                            : <img src={assets.cancel_icon} alt="Cancel" className="w-5" />
                          }

                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => handleCompleteAppointment(item.id)}>
                          {
                            isLoadingComplete
                              ? <BarLoader color="green" />
                              : <img src={assets.tick_icon} alt="Complete" className="w-5" />
                          }


                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          }
        </Table>
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
      </Card>

    </div>
  );
};

export default Appointments;

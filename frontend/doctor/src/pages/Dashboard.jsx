import { useEffect, useState } from 'react';
import { getDashboardData } from '../api/dashboardAPI';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { extractDateAndTime } from '../utils/datetimeFormat';
import DashboardCard from '../components/DashboardCard';
import { cancelAppointment, completeAppointment } from '../api/appointmentAPI';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarLoader } from "react-spinners";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const getDashData = async () => {
    try {
      const { data, status } = await getDashboardData();
      if (status === 200) {
        setDashboardData(data);
        console.log(data);
      } else {
        console.log(data);
        toast.error(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    const refresh = async () => {
      await getDashData();
    };
    refresh();
  }, []);

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setIsLoadingComplete(true);
      const { data, success } = await completeAppointment(appointmentId);
      if (success) {
        await getDashData(); // Refresh dashboard data
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to complete appointment");
    } finally {
      setIsLoadingComplete(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsLoadingCancel(true);
      const { data, success } = await cancelAppointment(appointmentId);
      if (success) {
        await getDashData();
        toast.success(data.message);
      } else {
        toast.error(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsLoadingCancel(false);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const differenceInMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(differenceInMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="p-5 w-full ">
      <div className="flex flex-wrap justify-evenly gap-3">
        <DashboardCard
          icon={assets.earning_icon}
          value={`$${dashboardData.total_earnings || 0}`}
          label="Earnings"
        />
        <DashboardCard
          icon={assets.patients_icon}
          value={dashboardData.total_patients || 0}
          label="Patients"
        />
        <DashboardCard
          icon={assets.appointments_icon}
          value={dashboardData.total_appointments || 0}
          label="Appointments"
        />
      </div>

      <div className="border border-t-0 border-gray-100">
        <div className="w-full max-w-6xl mx-auto p-5">
          <Card className="overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 py-4 px-4  rounded-t">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
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
              <TableBody>
                {dashboardData.latest_appointments?.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 ">
                    <TableCell className={`ps-5`}>{index + 1}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={item.patient.user?.image} alt="Patient Image" />
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
                          <Button
                            variant='secondary'
                            size="icon"
                            onClick={() => handleCancelAppointment(item.id)}
                            disabled={isLoadingCancel}
                          >
                            {isLoadingCancel
                              ? <BarLoader color="red" />
                              : <img src={assets.cancel_icon} alt="Cancel" className="w-5" />
                            }
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleCompleteAppointment(item.id)}
                            disabled={isLoadingComplete}
                          >
                            {isLoadingComplete
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
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
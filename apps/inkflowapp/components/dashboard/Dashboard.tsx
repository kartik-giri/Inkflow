"use client"
import { useState } from "react";
import CreateCanvas from "./CreateCanvas";
import DashNavBar from "./dashNavbar"
import Table from "./Table";
import Title from "./Title"

export type Room = {
    id: number;
    created_at: Date;
    updated_at: Date;
    slug: string;
    adminId: number;
}

type DashBoardProp ={
    id: string,
    name: string,
    email: string
    rooms: Room[]
}
const Dashboard = ({id,name,email, rooms}: DashBoardProp)=>{

    const [open, setOpen] = useState<boolean>(false)
    return (
        <section>
            <DashNavBar email={email} name={name} />
            <Title setOpen={setOpen} name={name} />
            <Table rooms={rooms}/>
            {open && <CreateCanvas setClose ={setOpen}/>}
            
        </section>
    )
}

export default Dashboard
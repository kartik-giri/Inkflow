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
    return (
        <section>
            <DashNavBar email={email} name={name} />
            <Title  name={name}/>
            <Table rooms={rooms}/>
        </section>
    )
}

export default Dashboard
import DashNavBar from "./dashNavbar"
import Title from "./Title"

type User ={
    id: string,
    name: string,
    email: string
}
const Dashboard = ({id,name,email}: User)=>{
    return (
        <section>
            <DashNavBar email={email} name={name} />
            <Title  name={name}/>
        </section>
    )
}

export default Dashboard
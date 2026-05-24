import { getServerSession } from "next-auth"

const Home = async()=>{
  const session = await getServerSession();
  return <div>
    InkFlow app
    {JSON.stringify(session)}
  </div>
}

export default Home
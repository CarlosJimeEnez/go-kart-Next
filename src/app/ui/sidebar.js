import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart' 
import WarehouseIcon from '@mui/icons-material/Warehouse'

export default function Sidebar(){
    return (
        <div className="flex flex-col h-screen">
        <div className="flex flex-col justify-evenly items-center h-[70vh]">
            <nav>
                <div className="flex justify-center items-center bg-white rounded-full w-12 h-12 mt-3 hover:bg-shadows hover:text-background">
                    <DashboardIcon/>
                </div>
                <div className="flex justify-center items-center bg-white rounded-full w-12 h-12 mt-3 hover:bg-shadows hover:text-background">
                    <BarChartIcon/>
                </div>
                <div className="flex justify-center items-center bg-white rounded-full w-12 h-12 mt-3 hover:bg-shadows hover:text-background">
                <WarehouseIcon/>
                </div>
            </nav>
        </div>
    </div>
    )
}
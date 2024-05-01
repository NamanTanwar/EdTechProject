import React from 'react';

const stats=[
    {id:1, count:"5K" ,label: "Active Students"},
    {id:2, count:"50" ,label: "Mentors"},
    {id:3, count:"200+" ,label: "Courses"},
    {id:4, count:"50+" ,label: "Awards"}
]

const StatsComponent=()=>{
    return (
        <section>
        <div>
            <div className="flex flex-row items-center">
                {
                    stats.map((data)=>{
                        return <div key={data.id}>
                        <h1>{data.count}</h1>
                        <p>{data.label}</p>
                        </div>
                    })
                }
            </div>
        </div>

        </section>
    )
}

export default StatsComponent;
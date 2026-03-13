import type { GeojsonProps, ListGeojsonProps } from "../interface/geojson.interface"
import { DATASETS } from "../data/dataset"
import ItemGeo from "./ItemGeo"
import { getYears } from "../request/get-years"
import CircularIndeterminate from "./modals/CircularProgress"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Tabs, Tab, Box, IconButton, Collapse } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"

import { useMap } from '../store/MapContext'

const empresasImg = [
    { src: "/img/empresa1.png", alt: "Empresa 1" },
    { src: "/img/empresa2.png", alt: "Empresa 2" },
    { src: "/img/empresa3.png", alt: "Empresa 3" },
]

const ListDataGeo = ({ dataset }: ListGeojsonProps) => {

    const [tabIndex, setTabIndex] = useState(0)
    const [open, setOpen] = useState(false)

    const map = useMap()

    const { data: years, isLoading } = useQuery<string[] | null>({
        queryKey: ["datasetData", dataset],
        queryFn: () => getYears(DATASETS[dataset!].api),
        enabled: !!dataset,
        staleTime: 1000 * 60 * 60
    })

    useEffect(() => {
        if (dataset) {
            setOpen(true)
            setTabIndex(0)
        } else {
            setOpen(false)
        }
    }, [dataset])

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue)
    }

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 1300,
            }}
        >

            <Box display="flex" justifyContent="center">

                <IconButton
                    sx={{
                        bgcolor: "white",
                        color: "var(--color-primary)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        mb: open ? 1 : 0
                    }}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>

            </Box>

            <Collapse in={open} orientation="vertical">

                <Box
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 8,

                    }}
                >

                    <Tabs value={tabIndex} onChange={handleTabChange}>

                        <Tab label="Datos" />
                        <Tab label="Creditos" />

                    </Tabs>

                    <Box>

                        {tabIndex === 0 && (

                            <div className="h-[150px] overflow-auto bg-slate-200 text-black p-2 flex gap-1 flex-wrap">

                                {isLoading ? (

                                    <CircularIndeterminate />

                                ) : years && years.length > 0 ? (

                                    years?.map((year) => (

                                        <ItemGeo
                                            key={`${dataset}-${year}`}
                                            fileName={`${DATASETS[dataset!]?.api} ${year}`}
                                            rangeDate={year}
                                            //map={map}
                                            dataset={dataset!}
                                            markerShape={DATASETS[dataset!]?.marker}
                                        />

                                    ))

                                ) : (

                                    <Box textAlign="center" width="100%">
                                        No hay datos disponibles
                                    </Box>

                                )}

                            </div>

                        )}

                        {tabIndex === 1 && (

                            <Box
                                display="flex"
                                justifyContent="center"
                                flexWrap="wrap"
                                gap={2}
                                minHeight={150}
                            >

                                {empresasImg.map((img) => (

                                    <Box
                                        key={img.alt}
                                        width={80}
                                        height={80}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >

                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            style={{ maxWidth: "70px" }}
                                        />

                                    </Box>

                                ))}

                            </Box>

                        )}

                    </Box>

                </Box>

            </Collapse>

        </Box>
    )
}

export default ListDataGeo
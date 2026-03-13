import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DATASETS } from "../data/dataset";
import Typography from '@mui/material/Typography';
import { toggleGeoJsonOnMap } from '../utils/addGeojson';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, CardActions } from '@mui/material';
import CustomButton from './CustomButton';
import { useLocalStorageContext } from '../store/localStorageContext';
import { getStationsByYear } from "../request/get-years"
import { useQuery } from '@tanstack/react-query'
import { useMap } from '../store/MapContext';
import CircularIndeterminate from "./modals/CircularProgress"


interface ItemGeoProps {
    fileName: string
    rangeDate: string
    //map: any
    markerShape: any
    dataset: keyof typeof DATASETS
}

export default function ItemGeo({
    fileName,
    rangeDate,
    //map,
    markerShape,
    dataset
}: ItemGeoProps) {

    const map = useMap()

    if (!map) return <div>No hay datos...</div>

    const {
        modal: { handleFeatureClick },
        visibility,
        toggleVisibility,
        addGeoChip,
        removeGeoChip
    } = useLocalStorageContext()

    const isVisible = visibility[fileName] ?? false

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['stationData', dataset, rangeDate],
        queryFn: async () => {
            const datasetConfig = DATASETS[dataset]
            return await getStationsByYear(datasetConfig.api, rangeDate)
        },
        enabled: false,
        staleTime: 1000 * 60 * 60 * 24,
        retry: 1,
    })

    const handleClick = async () => {
        if (!map || isLoading) return

        try {
            const result = data || (await refetch().then(res => res.data))

            if (!result) return

            toggleGeoJsonOnMap(
                map,
                result.geojson,
                fileName,
                markerShape,
                handleFeatureClick
            )

            toggleVisibility(fileName)

            if (isVisible) {
                removeGeoChip(fileName)
            } else {
                addGeoChip(fileName)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }


    return (

        <Card
            variant="outlined"
            onClick={handleClick} 
            sx={{
                borderRadius: 4,
                transition: "0.2s",
                cursor: "pointer",  
                opacity: isLoading ? 0.7 : 1,
                pointerEvents: isLoading ? 'none' : 'auto',
                "&:hover": {
                    boxShadow: isLoading ? 1 : 3,
                    transform: isLoading ? 'none' : "translateY(-2px)"
                },
                
                '& *': {
                    pointerEvents: 'none'
                },
                '& .MuiCardActions-root, & .MuiIconButton-root': {
                    pointerEvents: 'auto'
                }
            }}
        >

            <CardContent sx={{ pointerEvents: 'none' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={14}>
                        {rangeDate}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoading && <CircularIndeterminate compact size={14} showText={false} />}
                        {isVisible && <VisibilityIcon color="info" />}
                    </Box>
                </Box>

                <Typography variant="h6">
                    {fileName.toUpperCase()}
                </Typography>
            </CardContent>

            <CardActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 3,
                    pointerEvents: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <CustomButton
                    dataset={dataset}
                    year={rangeDate}   
                />
            </CardActions>

        </Card>

    )
}
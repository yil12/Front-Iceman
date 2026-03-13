import { IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import downloadExcel from "../request/get-depth-to-excel";
import type { DatasetKey } from "../data/dataset";

interface ButtonProps {
    dataset: DatasetKey;
    year: string;  
}

export default function CustomButton({
    dataset,
    year,
}: Readonly<ButtonProps>) {

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();  // ✅ Evita que el clic llegue al Card
        
        if (year) {
            downloadExcel(dataset, year);
        }
    };

    return (
        <IconButton
            edge='end'
            aria-label='download'
            sx={{
                color: '#074dafff',
                borderRadius: '10px',
                padding: '4px 2px',
                '&:hover': {
                    backgroundColor: '#7d8bf3',
                }
            }}
            onClick={handleDownload} disabled={!year}>
            <FileDownloadIcon />
        </IconButton>
    );
}
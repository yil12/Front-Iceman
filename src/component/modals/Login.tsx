// src/component/modals/Login.tsx - CORREGIDO

import { useForm } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    Modal
} from "@mui/material";
import { useLocalStorageContext } from "../../store/localStorageContext";

interface LoginProps {
    open: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
    user: string;
    password: string;
};

export default function Login({ open, onClose }: Readonly<LoginProps>) {
    const { register, handleSubmit, reset } = useForm<FormData>();
    
    // ✅ NO usar setValue del contexto aquí (es para GeojsonMap, no para login)
    // const { setValue } = useLocalStorageContext();  ← Eliminar o no usar

    const onSubmit = (data: FormData) => {
        console.log("Nombre de usuario:", data.user);
        console.log("contraseña:", data.password);
        
        // ✅ Guardar datos de usuario en localStorage directamente
        localStorage.setItem('user_name', data.user);
        // Opcional: guardar más datos si los necesitas
        // localStorage.setItem('user_logged', 'true');
        
        reset();
        onClose(false);
    };

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 340,
        borderRadius: 2,
        color: '#8c8888',
        boxShadow: 24,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#f5f5f5",
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={style}
            >
                <TextField
                    label="Usuario"
                    {...register("user", { required: true })}
                    fullWidth
                />
                <TextField
                    type="password"
                    label="Contraseña"
                    {...register("password", { required: true })}
                    fullWidth
                />
                <Button variant="contained" type="submit">
                    Enviar datos
                </Button>
            </Box>
        </Modal>
    );
}
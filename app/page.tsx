import Profile from "@/components/profile"

import ImageUpload from "@/components/imageUpload"
import { Box } from "@mui/material"

import ImageGallery from "@/components/imageGallery"

export default function Home() {
    return (
        <main>
            <Profile />
            <Box sx={{ p: 2 }}>
                <ImageUpload />
                <ImageGallery />
            </Box>
        </main>
    )
}

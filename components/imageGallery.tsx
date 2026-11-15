'use client'

import { useEffect, useState } from "react"

import { Box, Typography, IconButton, CircularProgress } from "@mui/material"

import { DeleteOutlineOutlined } from "@mui/icons-material"

import { useImageContext } from "@/context/imageContext"

export default function ImageGallery() {

    const { images, getImages, deleteImage } = useImageContext()

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getImages().finally(() => setLoading(false))
    }, [])


    if (loading) {return <CircularProgress />}

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                My Images ({images.length})
            </Typography>

            {images.length === 0 ? (
                <Typography color="text.secondary">
                    You haven't uploaded any images yet.
                </Typography>
            ):(
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: 2
                    }}
                >
                    {images.map(image => (
                        <Box key={image.pathname} sx={{
                            position: "relative",
                            aspectRatio: "1",
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "grey.200"
                        }}>
                            <Box component="img" src={image.url} alt="Uploaded image" sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}/>
                            <IconButton size="small" onClick={() => deleteImage(image.pathname)} sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                bgcolor: "white",
                                "&:hover": {bgcolor: "grey.200"}
                            }}>
                                <DeleteOutlineOutlined />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    )
}

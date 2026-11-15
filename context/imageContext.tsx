'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// create a type for your props

// need to store the imagesUrls
// need to get the imageUrls method: GET
// need a function to delete an image by URL method: DELETE

//  components:
// show our gallery
// image needs a delete icon so the user can click that to trigger the delete function

type Image = {
    url: string
    pathname: string
}

type ImageContextProps = {
    images: Image[]
    uploadImages: (images: File[]) => Promise<void>
    getImages: () => Promise<void>
    deleteImage: (pathname: string) => Promise<void>
}

// create a context variable
const ImageContext = createContext<ImageContextProps | undefined>(undefined)

// create a context provider
export function ImageContextProvider(props: { children: ReactNode }) {

    const [images, setImages] = useState<Image[]>([])
    
    async function uploadImages(files: File[]){

        const formData = new FormData()

        files.forEach(image=>formData.append("images", image))

        const response = await fetch("/api/images", {method: "POST", body: formData})

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Image upload failed")
        }

        await getImages()

        // console.log(data.imageUrls)
    }

    async function getImages(){

        const response = await fetch("/api/images")

        const data = await response.json()

        setImages(data.imageUrls || [])
    }

    async function deleteImage(pathname: string){

        const response = await fetch("/api/images", {
            method: "DELETE", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({pathname})
        })

        if (response.ok) {
            setImages(prev =>prev.filter(image => image.pathname !== pathname))
        }
    }


    return (
        <ImageContext.Provider value={{ images, uploadImages, getImages, deleteImage }}>
            {props.children}
        </ImageContext.Provider>
    )
}

// create a function to use the context
export function useImageContext() {
    const context = useContext(ImageContext)
    if (!context) {
        throw new Error('useProfileContext must be used within a ProfileContextProvider')
    }
    return context
}
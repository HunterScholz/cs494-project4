import { put, list, del } from "@vercel/blob"

import { createClient } from "@/lib/supabase/server"

import { generateFileName } from "@/lib/file"

export async function POST(request: Request) {

    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    if (!user || !user.data.user) {
        return Response.json({ error: "User not authenticated" })
    }

    const id = user.data.user.id

    const formData = await request.formData()

    const images = formData.getAll("images")

    // console.log(images[0])

    const urls = []

    for (let i = 0; i < images.length; i++) {

        const { url } = await put(`${id}/${generateFileName()}`, images[i] as File, { access: 'public' })
        urls.push(url)
    }

    return Response.json({ "imageUrls": urls })
}

export async function GET() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    if (!user || !user.data.user) {
        return Response.json({ error: "User not authenticated" })
    }

    const id = user.data.user.id

    // console.log(id)

    const blobs = (await list({prefix: `${id}/`})).blobs

    const imageUrls = blobs.map(blob=>({
        url: blob.url,
        pathname: blob.pathname
    }))

    return Response.json({imageUrls})

}

export async function DELETE(request: Request) {
    // should be able to delete a file by path

    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    if (!user || !user.data.user) {
        return Response.json({ error: "User not authenticated" })
    }

    const id = user.data.user.id

    const {pathname} = await request.json()

    const blobs = (await list({prefix: `${id}/`})).blobs
    const blob = blobs.find(blob => blob.pathname === pathname)

    if (!blob){
        return Response.json({ error: "Image not found" }, { status: 404 })
    }

    await del(blob.url)

    return Response.json({success: true})

}
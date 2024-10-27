'use client'

import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {ImagesList} from "@/components/list/images-list";
import {ImageMetadata} from "@/components/list/types";
import {UploadDropzone} from "@/components/uploader/upload-dropzone";

export default function UploadCard() {
	const [images, setImages] = useState<ImageMetadata[]>([])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(event.target.files || []).map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			status: 'pending',
			url: URL.createObjectURL(file)
		} satisfies ImageMetadata))
		setImages([...images, ...newFiles])
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xl md:text-2xl font-bold">Image Converter for Anastasia</CardTitle>
				<Avatar>
					<AvatarImage src="/placeholder-avatar.jpg" alt="User"/>
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<UploadDropzone onChange={handleFileChange}/>
					{images.length > 0 && (<ImagesList images={images}/>)}
				</div>
			</CardContent>
		</Card>
	)
}
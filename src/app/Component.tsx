'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Upload, Image as ImageIcon, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

type ImageStatus = 'pending' | 'converting' | 'completed' | 'failed'

interface ImageFile {
	id: string
	name: string
	status: ImageStatus
	url: string
}

export default function Component() {
	const [images, setImages] = useState<ImageFile[]>([])
	const [converting, setConverting] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const imagesPerPage = 6

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(event.target.files || []).map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			status: 'pending' as ImageStatus,
			url: URL.createObjectURL(file)
		}))
		setImages([...images, ...newFiles])
	}

	const handleConvert = () => {
		setConverting(true)
		setImages(images.map(img => img.status === 'pending' ? { ...img, status: 'converting' } : img))
		// Simulating conversion process
		setTimeout(() => {
			setImages(images.map(img =>
				img.status === 'converting' ? { ...img, status: Math.random() > 0.9 ? 'failed' : 'completed' } : img
			))
			setConverting(false)
		}, 3000)
	}

	const indexOfLastImage = currentPage * imagesPerPage
	const indexOfFirstImage = indexOfLastImage - imagesPerPage
	const currentImages = images.slice(indexOfFirstImage, indexOfLastImage)

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-bold">Advanced Image Converter</CardTitle>
				<Avatar>
					<AvatarImage src="/placeholder-avatar.jpg" alt="User" />
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-center w-full">
						<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<Upload className="w-6 h-6 mb-2 text-gray-400" />
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">HEIF images (MAX. 800x400px)</p>
							</div>
							<input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
						</label>
					</div>
					{images.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{currentImages.map((image) => (
								<Dialog key={image.id}>
									<DialogTrigger asChild>
										<div className="relative aspect-square cursor-pointer">
											<img src={image.url} alt={image.name} className="object-cover w-full h-full rounded-lg" />
											<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
												<ImageIcon className="w-8 h-8 text-white" />
											</div>
											<div className="absolute bottom-2 right-2 p-1 rounded-full bg-white">
												{image.status === 'pending' && <Upload className="w-4 h-4 text-yellow-500" />}
												{image.status === 'converting' && <Progress value={66} className="w-4 h-4" />}
												{image.status === 'completed' && <Check className="w-4 h-4 text-green-500" />}
												{image.status === 'failed' && <X className="w-4 h-4 text-red-500" />}
											</div>
										</div>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>{image.name}</DialogTitle>
											<DialogDescription>Status: {image.status}</DialogDescription>
										</DialogHeader>
										<div className="mt-4">
											<img src={image.url} alt={image.name} className="w-full rounded-lg" />
										</div>
									</DialogContent>
								</Dialog>
							))}
						</div>
					)}
					{images.length > imagesPerPage && (
						<div className="flex justify-center mt-4 space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === Math.ceil(images.length / imagesPerPage)}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={handleConvert} disabled={images.filter(img => img.status === 'pending').length === 0 || converting}>
					{converting ? (
						<>
							<Progress value={66} className="w-full" />
							Converting...
						</>
					) : (
						'Convert to JPG'
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
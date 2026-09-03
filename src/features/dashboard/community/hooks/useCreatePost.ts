"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
	useCreatePostMutation,
	useUploadPostImageMutation,
	useUnpublishPostMutation,
} from "../api/communityEndpoints";
import { POST_CONTENT_MAX_LENGTH } from "../constants";

const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface UseCreatePostReturn {
	isSubmitting: boolean;
	isSuccess: boolean;
	errors: Record<string, string>;
	content: string;
	setContent: (content: string) => void;
	imagePreview: string | null;
	isUploading: boolean;
	handleImageSelect: (file: File) => void;
	removeImage: () => void;
	handleSubmit: (data: {
		content: string;
		status?: "published" | "draft";
	}) => Promise<boolean>;
	reset: () => void;
}

export function useCreatePost(): UseCreatePostReturn {
	const [createPost, { isLoading, isSuccess }] = useCreatePostMutation();
	const [unpublishPost] = useUnpublishPostMutation();
	const [uploadImage] = useUploadPostImageMutation();

	const [content, setContent] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleImageSelect = useCallback(
		async (file: File) => {
			if (!file.type.startsWith("image/")) {
				toast.error("Please upload an image file");
				return;
			}
			if (file.size > IMAGE_MAX_SIZE_BYTES) {
				toast.error("Image size must be less than 5MB");
				return;
			}

			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			setIsUploading(true);

			try {
				const uploadResult = await uploadImage(file).unwrap();
				setUploadedImageUrl(uploadResult.large);
			} catch {
				toast.error("Failed to upload image");
				setImagePreview(null);
			} finally {
				setIsUploading(false);
			}
		},
		[uploadImage],
	);

	const removeImage = useCallback(() => {
		setImagePreview(null);
		setUploadedImageUrl(null);
	}, []);

	const handleSubmit = useCallback(
		async (data: {
			content: string;
			status?: "published" | "draft";
		}): Promise<boolean> => {
			setErrors({});
			const newErrors: Record<string, string> = {};

			if (!data.content.trim()) {
				newErrors.content = "Content is required";
			}

			if (data.content.length > POST_CONTENT_MAX_LENGTH) {
				newErrors.content = `Content must be ${POST_CONTENT_MAX_LENGTH} characters or less`;
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return false;
			}

			if (isUploading) {
				toast.error("Please wait for the image to finish uploading");
				return false;
			}

			const postTitle =
				data.content.length > 60
					? data.content.slice(0, 60) + "..."
					: data.content;

			const media = uploadedImageUrl
				? [{ type: "photo" as const, url: uploadedImageUrl }]
				: [];

			try {
				const result = await createPost({
					title: postTitle,
					content: data.content,
					seoTitle: postTitle.slice(0, 60),
					seoDescription: data.content.slice(0, 160),
					media,
				}).unwrap();

				if (data.status === "draft" && result?.id) {
					await unpublishPost(result.id).unwrap();
				}

				toast.success("Post created");
				reset();
				return true;
			} catch (err: unknown) {
				const apiError = err as {
					data?: { message?: string };
					message?: string;
				};
				toast.error(
					apiError?.data?.message ||
						apiError?.message ||
						"Failed to create post",
				);
				return false;
			}
		},
		[createPost, unpublishPost, uploadedImageUrl, isUploading],
	);

	const reset = useCallback(() => {
		setContent("");
		setErrors({});
		setImagePreview(null);
		setUploadedImageUrl(null);
	}, []);

	return {
		isSubmitting: isLoading,
		isSuccess,
		errors,
		content,
		setContent,
		imagePreview,
		isUploading,
		handleImageSelect,
		removeImage,
		handleSubmit,
		reset,
	};
}

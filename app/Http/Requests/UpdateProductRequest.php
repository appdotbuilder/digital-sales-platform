<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $product = $this->route('product');
        return auth()->check() && 
               (auth()->user()->isAdmin() || auth()->id() === $product->seller_id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0.01|max:9999.99',
            'category' => 'required|string|max:100',
            'digital_file' => 'nullable|file|mimes:zip,pdf,mp4,mp3,jpg,png,svg|max:102400', // 100MB max
            'preview_image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048', // 2MB max
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'download_limit' => 'required|integer|min:1|max:50',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'description.required' => 'Product description is required.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price must be at least $0.01.',
            'category.required' => 'Product category is required.',
            'digital_file.mimes' => 'Digital file must be a valid file type (zip, pdf, mp4, mp3, jpg, png, svg).',
            'digital_file.max' => 'Digital file size must not exceed 100MB.',
            'preview_image.image' => 'Preview image must be a valid image file.',
            'preview_image.max' => 'Preview image size must not exceed 2MB.',
            'download_limit.required' => 'Download limit is required.',
            'download_limit.min' => 'Download limit must be at least 1.',
            'download_limit.max' => 'Download limit cannot exceed 50.',
        ];
    }
}
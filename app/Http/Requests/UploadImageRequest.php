<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'max:5120',
                'mimes:jpeg,png,jpg,gif,webp'
            ],
            'order' => 'required|integer|min:0',
            'id' => 'required|ulid',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Please select an image to upload.',
            'image.image' => 'The file must be a valid image.',
            'image.max' => 'The image size cannot exceed 5MB.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif, webp.',
            'order.required' => 'Image order is required.',
            'order.integer' => 'Image order must be a valid number.',
            'order.min' => 'Image order cannot be negative.',
            'id.required' => 'Image ID is required.',
            'id.ulid' => 'Image ID must be a valid ULID.',
        ];
    }
}

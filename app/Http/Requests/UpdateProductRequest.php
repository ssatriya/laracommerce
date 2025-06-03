<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateProductRequest extends FormRequest
{
    /**
     * Convert camelCase inputs to snake_case before validation.
     */
    public function all($keys = null)
    {
        $original = parent::all($keys);
        $snakeCased = [];

        foreach ($original as $key => $value) {
            $snakeCased[Str::snake($key)] = $value;
        }

        return $snakeCased;
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->toArray();
        $camelCaseErrors = [];

        foreach ($errors as $key => $message) {
            if (isset($errors['slug'])) {
                $errors['name'] = $errors['slug'];
                unset($errors['slug']);
            }
            $camelCaseKey = Str::camel($key);
            $camelCaseErrors[$camelCaseKey] = $message;
        }

        throw new ValidationException(
            $validator,
            redirect()
                ->back()
                ->withErrors($camelCaseErrors)
                ->withInput()
        );
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage products');
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        $this->merge([
            'slug' => Str::slug($name),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string",
            "slug" => [
                'required',
                'string',
                Rule::unique('products', 'slug')->ignore($this->product)
            ],
            "price" => "required|numeric",
            "quantity" => "required|integer",
            "description" => "required|string",
            "images" => "required|array|min:1",
            "category_id" => "required|string|exists:categories,id",
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama produk wajib diisi",
            "slug.unique" => "Slug produk sudah digunakan",
            "price.required" => "Harga produk wajib diisi",
            "quantity.required" => "Kuantitas produk wajib diisi",
            "description.required" => "Deskripsi produk wajib diisi",
            "images.required" => "Wajib memiliki minimal satu gambar",
            "category_id" => "Kategori produk wajib dipilih"
        ];
    }
}

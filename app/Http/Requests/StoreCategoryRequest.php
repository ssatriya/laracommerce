<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StoreCategoryRequest extends FormRequest
{
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
        $errors = (new ValidationException($validator))->errors();

        if (isset($errors['slug'])) {
            $errors['name'] = $errors['slug'];
            unset($errors['slug']);
        }

        throw new ValidationException(
            $validator,
            redirect()
                ->back()
                ->withErrors($errors)
                ->withInput()
        );
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage categories');
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        $this->merge([
            'slug' => Str::slug($name),
            'label' => Str::title($name),
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
            'slug' => 'required|string|unique:categories,slug',
            'label' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.unique' => 'Kategori sudah digunakan',
            'slug.required' => 'Nama kategori wajib diisi',
        ];
    }
}

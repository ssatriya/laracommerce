<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StoreOrderRequest extends FormRequest
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
        return $this->user()->can('buy product');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'total_price' => [
                'required',
                'numeric',
                'min:0',
                'max:92233720368547758.07',
            ],
            'shipping_address' => 'required|string',
            // Must be an array with at least one item
            'product_list' => 'required|array|min:1',

            // Each item must have a valid product ID and quantity
            'product_list.*.id' => 'required|exists:products,id',
            'product_list.*.quantity' => 'required|integer|min:1',
        ];
    }
}

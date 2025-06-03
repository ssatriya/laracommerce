<?php

namespace App\Traits\DataTable;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;


trait HasDataTableTrait
{
    use HasFilterTrait,
        HasLimitEntriesTrait,
        HasRelationsTrait,
        HasSearchTrait,
        HasSortingTrait;

    protected EloquentBuilder|QueryBuilder $query;

    /**
     * Generate the data table query based on the request.
     */
    public function make()
    {
        if (empty($this->query)) {
            throw new \InvalidArgumentException('Query must be set before calling make()');
        }

        if (!in_array($this->type, ['pagination', 'collection'])) {
            throw new \InvalidArgumentException('DataTable type must be pagination or collection');
        }

        $this->relations();
        $this->search();
        $this->filter();
        $this->sort();
        $query = $this->limit();

        if ($this->type === 'pagination') {
            $query->appends(request()->query());
        }

        return $query;
    }
}

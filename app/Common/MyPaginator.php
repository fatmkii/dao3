<?php
namespace App\Common;

use \Illuminate\Pagination\LengthAwarePaginator;


class MyPaginator extends LengthAwarePaginator
{
    public function toArray()
    {
        return [
            'currentPage' => $this->currentPage(),
            'data' => $this->items->toArray(),
            // 'first_page_url' => $this->url(1),
            // 'from' => $this->firstItem(),
            'lastPage' => $this->lastPage(),
            // 'last_page_url' => $this->url($this->lastPage()),
            // 'next_page_url' => $this->nextPageUrl(),
            // 'path' => $this->path,
            // 'perPage' => $this->perPage(),
            // 'prev_page_url' => $this->previousPageUrl(),
            // 'to' => $this->lastItem(),
            // 'total' => $this->total(),
        ];
    }
}
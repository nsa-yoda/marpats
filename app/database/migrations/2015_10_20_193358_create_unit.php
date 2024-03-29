<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUnit extends Migration {
    private $table = "unit";

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
        Schema::create($this->table, function (Blueprint $table){
            $table->increments('id');
            $table->integer('mailroom_id'); # mailroom relationship
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(){
        Schema::drop($this->table);
    }
}

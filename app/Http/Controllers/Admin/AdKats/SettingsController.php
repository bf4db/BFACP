<?php

namespace BFACP\Http\Controllers\Admin\Adkats;

use BFACP\Adkats\Setting;
use BFACP\Battlefield\Server\Server;
use BFACP\Http\Controllers\Controller;
use Illuminate\Support\Facades\View;

/**
 * Class SettingsController
 * @package BFACP\Http\Controllers\Admin\Adkats
 */
class SettingsController extends Controller
{
    public function index()
    {
        $servers = Server::all();

        return View::make('admin.adkats.settings.index', compact('servers'))->with('page_title',
            'AdKats Settings Server List');
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function edit($id)
    {
        $settings = Setting::where('server_id', $id)->get();

        return View::make('admin.adkats.settings.edit', compact('settings'))->with('page_title',
            sprintf('AdKats Settings for #%s', $id));
    }
}

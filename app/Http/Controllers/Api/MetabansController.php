<?php

namespace BFACP\Http\Controllers\Api;

use BFACP\Exceptions\MetabansException;
use BFACP\Facades\Main as MainHelper;
use BFACP\Libraries\Metabans;
use Illuminate\Support\Facades\Lang;

/**
 * Class MetabansController
 * @package BFACP\Http\Controllers\Api
 */
class MetabansController extends Controller
{
    protected $metabans;

    /**
     * @param Metabans $metabans
     */
    public function __construct(Metabans $metabans)
    {
        parent::__construct();
        $this->metabans = $metabans;
    }

    public function getIndex()
    {
        throw new MetabansException(405, 'Invalid Resource');
    }

    /**
     * @return mixed
     */
    public function getFeedAssessments()
    {
        $feed = $this->metabans->feed();
        $assessments = $this->metabans->assessments();

        $feed_assessments = [
            'feed'        => $feed,
            'assessments' => $assessments,
        ];

        return MainHelper::response($feed_assessments + [
                'locales' => Lang::get('common.metabans'),
            ], null, null, null, false, true);
    }

    /**
     * @return mixed
     */
    public function getFeed()
    {
        $feed = $this->metabans->feed();

        return MainHelper::response($feed, null, null, null, false, true);
    }

    /**
     * @return mixed
     */
    public function getAssessments()
    {
        $assessments = $this->metabans->assessments();

        return MainHelper::response($assessments, null, null, null, false, true);
    }
}

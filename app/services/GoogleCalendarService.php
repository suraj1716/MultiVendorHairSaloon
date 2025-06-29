<?php
namespace App\Services;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    protected Client $client;
    protected Calendar $calendar;

   public ?string $newAccessToken = null;

public function __construct(array $token)
{
    $this->client = new Client();
    $this->client->setClientId(config('services.google.client_id'));
    $this->client->setClientSecret(config('services.google.client_secret'));
    $this->client->setRedirectUri(config('services.google.redirect'));
    $this->client->setAccessType('offline');
    $this->client->setScopes([Calendar::CALENDAR]);

    $this->client->setAccessToken($token);

    // Refresh if expired
    if ($this->client->isAccessTokenExpired() && isset($token['refresh_token'])) {
        $newToken = $this->client->fetchAccessTokenWithRefreshToken($token['refresh_token']);

        if (!isset($newToken['error'])) {
            $newToken['refresh_token'] = $token['refresh_token']; // re-attach
            $this->client->setAccessToken($newToken);
            $this->newAccessToken = json_encode($newToken);
        }
    }

    $this->calendar = new Calendar($this->client);
}



public function createEvent(
    string $summary,
    string $description,
    string $startDateTime,
    string $endDateTime,
    string $timeZone = 'UTC',
    string $location = null,
    string $eventId = null,
    array $attendees = [],
    array $reminders = [['method' => 'popup', 'minutes' => 30]] // ✅ default 30 mins
) {
    $eventData = [
        'summary' => $summary,
        'description' => $description,
        'start' => new EventDateTime([
            'dateTime' => $startDateTime,
            'timeZone' => $timeZone,
        ]),
        'end' => new EventDateTime([
            'dateTime' => $endDateTime,
            'timeZone' => $timeZone,
        ]),
        'reminders' => [
            'useDefault' => false,
            'overrides' => $reminders,
        ],
    ];

    if ($location) {
        $eventData['location'] = $location;
    }

    if ($eventId) {
        $eventData['id'] = strtolower($eventId);
    }

    if (!empty($attendees)) {
        $eventData['attendees'] = array_map(fn($email) => ['email' => $email], $attendees);
    }

    $event = new Event($eventData);

    try {
        return $this->calendar->events->insert('primary', $event);
    } catch (\Exception $e) {
        Log::error('Google insert failed', [
            'message' => $e->getMessage(),
            'access_token' => $this->client->getAccessToken(),
        ]);
        throw $e;
    }
}


public function updateEvent(
    string $eventId,
    string $summary,
    string $description,
    string $startDateTime,
    string $endDateTime,
    string $timeZone = 'UTC',
    string $location = null

) {
    try {
        $event = $this->calendar->events->get('primary', $eventId);

        $event->setSummary($summary);
        $event->setDescription($description);
        $event->setStart(new EventDateTime([
            'dateTime' => $startDateTime,
            'timeZone' => $timeZone,
        ]));
        $event->setEnd(new EventDateTime([
            'dateTime' => $endDateTime,
            'timeZone' => $timeZone,
        ]));

        if ($location) {
            $event->setLocation($location);
        }

        return $this->calendar->events->update('primary', $eventId, $event);
    } catch (\Exception $e) {
        Log::error('Google update failed', [
            'message' => $e->getMessage(),
            'event_id' => $eventId,
            'access_token' => $this->client->getAccessToken(),
        ]);
        throw $e;
    }
}


    public function deleteEvent(string $eventId)
{

    return $this->calendar->events->delete('primary', $eventId);
}
}

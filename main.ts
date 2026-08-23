// main.ts
Deno.serve(async(request: Request) => {
  const url=new URL(request.url)
  const viewkey = url.searchParams.get("id");
  const quality = url.searchParams.get("quality");

  const res = await fetch(`https://www.pornhub.com/view_video.php?viewkey=${viewkey}`, {
    headers: {
      cookie:
        'bsdd=5a139d877ac20c3306938c24ccd4154d; ss=664813946333688789; sessid=386455536550499184; comp_detect-cookies=16565.100000; fg_afaf12e314c5419a855ddc0bf120670f=33910.100000; fg_55e3b6f0afd46366d6fa797544b15af2=13169.100000; __l=69EDE8A5-42FE722901BB2E0CA0-B61F6FF; cookieConsent=3; g_state={"i_l":0,"i_ll":1778859559679,"i_e":{"enable_itp_optimization":19},"i_et":1777199274212}; lvv=296421843164546810; vlc=242583487362379306; fg_439f2555043a44b8bd91161b5deddd29=67776.100000; fg_7d31324eedb583147b6dcbea0051c868…ed06; __s=6A06D491-42FE722901BB85F25-725F8F2; rp=3032483397:nBPtcyIzP3s=; etavt=%7B%22ph617cfa6c5ea77%22%3A%224_3_2_pornhub.SearchVideoService.208.209%7C2%22%2C%2266628a11569c1%22%3A%223_1_2_pornhub.video_recommendation.93%7C1%22%2C%226733a4e679f87%22%3A%221_24_2_NA%7C0%22%7D; accessAgeDisclaimerPH=2; desired_username=85d32f7%7Chusseinxyz004%40gmail.com; il=v1TTekgKCH6y6b_3af34YLbBMa4xj1Xp4TQ9Gd_q4Z12gxNzk0NjcwNzcxMW9ibkY2eG5jV0F0TlJPTVEtME1QOGZxYUJLb19mX1lCNjl6NWVSWA..; bs=5a139d877ac20c3306938c24ccd4154d'
          .replace(/\u2026/g, "") // remove ellipsis
          .replace(/[^\x20-\x7E]/g, ""),
    },
  }).then((r) => r.text());

  //  fs.writeFileSync("b.html", res);

  const flashvarsMatch = res.match(/var flashvars_\d+ = ({.+?});\s*\n/s);
  if (!flashvarsMatch) throw new Error("flashvars not found");

  const json = flashvarsMatch[1].replace(/\\\//g, "/");
  const flashvars = JSON.parse(json);

  const mediaDefinitions: Array<{
    videoUrl: string;
    format: string;
    quality: string | [];
  }> = flashvars.mediaDefinitions;

  const videos: typeof mediaDefinitions = await fetch(mediaDefinitions.at(-1)?.videoUrl!, {
    headers: {
      cookie:
        'bsdd=5a139d877ac20c3306938c24ccd4154d; ss=664813946333688789; sessid=386455536550499184; comp_detect-cookies=16565.100000; fg_afaf12e314c5419a855ddc0bf120670f=33910.100000; fg_55e3b6f0afd46366d6fa797544b15af2=13169.100000; __l=69EDE8A5-42FE722901BB2E0CA0-B61F6FF; cookieConsent=3; g_state={"i_l":0,"i_ll":1778859559679,"i_e":{"enable_itp_optimization":19},"i_et":1777199274212}; lvv=296421843164546810; vlc=242583487362379306; fg_439f2555043a44b8bd91161b5deddd29=67776.100000; fg_7d31324eedb583147b6dcbea0051c868…ed06; __s=6A06D491-42FE722901BB85F25-725F8F2; rp=3032483397:nBPtcyIzP3s=; etavt=%7B%22ph617cfa6c5ea77%22%3A%224_3_2_pornhub.SearchVideoService.208.209%7C2%22%2C%2266628a11569c1%22%3A%223_1_2_pornhub.video_recommendation.93%7C1%22%2C%226733a4e679f87%22%3A%221_24_2_NA%7C0%22%7D; accessAgeDisclaimerPH=2; desired_username=85d32f7%7Chusseinxyz004%40gmail.com; il=v1TTekgKCH6y6b_3af34YLbBMa4xj1Xp4TQ9Gd_q4Z12gxNzk0NjcwNzcxMW9ibkY2eG5jV0F0TlJPTVEtME1QOGZxYUJLb19mX1lCNjl6NWVSWA..; bs=5a139d877ac20c3306938c24ccd4154d'
          .replace(/\u2026/g, "") // remove ellipsis
          .replace(/[^\x20-\x7E]/g, ""),
    },
  }).then((r) => r.json());

  const newHeaders = new Headers();
  newHeaders.set("referer", "https://www.pornhub.com/");
  newHeaders.set("range", request.headers.get("range") || "bytes=0-");

  // h3Event.waitUntil(
  //   (async () => {
  //     console.log(
  //       Object.fromEntries(
  //         await Promise.all(
  //           videos.map(async (a) => [
  //             a.quality,
  //             filesize(
  //               await fetch(a.videoUrl, { headers: newHeaders }).then((r) =>
  //                 r.headers.get("content-length"),
  //               ),
  //             ),
  //           ]),
  //         ),
  //       ),
  //     );
  //   })(),
  // );

  const video = await fetch(
    videos.find((v) => (quality ? v.quality === quality : v.defaultQuality))?.videoUrl,
    {
      headers: newHeaders,
    },
  );

  const newHeaders2 = new Headers(video.headers);
  newHeaders2.delete("cache-control");
newHeaders2.set('content-disposition','file')
  return new Response(video.body, { headers: newHeaders2 });
});
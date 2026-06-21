// =====================================================================
// TUNING DEFAULTS — fully annotated reference
// =====================================================================
// If you mess up the movement while experimenting, copy this entire
// object back into the TUNING block at the top of index.html.
//
// Each value is annotated with:
//   - What it controls (one-line summary)
//   - Detailed explanation of how it affects gameplay
//   - How it interacts with other values
//   - What happens when you INCREASE it
//   - What happens when you DECREASE it
//   - Typical safe range (going outside this usually breaks something)
//
// VALUES ARE HIGHLY INTERDEPENDENT — change one at a time and test.
// =====================================================================

const TUNING = {

    // =================================================================
    // 1. CORE MOVEMENT — fundamental physics that everything else builds on
    // =================================================================

    // Downward acceleration applied every frame while airborne (not grounded,
    // not wall-running). Measured in units/second².
    //   Max jump height = jumpForce² / (2 × gravity)
    //   Air time (up + down) = 2 × jumpForce / gravity
    // INCREASE: jumps feel snappier and shorter, falls feel heavier.
    //   - At 30+, the slide-jump pop evaporates before you can chain
    //   - At 50+, jumps feel likeMario 1 with no hang time
    // DECREASE: jumps feel floatier, more air time for strafe-jumping.
    //   - At 15, the game feels like Roblox Grace (long hang time)
    //   - At 10, you can air-strafe across the entire map in one jump
    // SAFE RANGE: 18-30. Lower than 15 = too floaty; higher than 35 = too snappy.
    gravity: 24.0,

    // Gravity used while wall-running instead of the normal gravity.
    // Lower than gravity so you stick to walls and don't immediately slide down.
    // INCREASE: wall-runs end faster, you slide down walls quickly.
    // DECREASE: wall-runs last longer, you hang almost motionless.
    //   - At 0, you can wall-run horizontally forever
    //   - At 10+, wall-running feels pointless (you drop too fast)
    // INTERACTS WITH: wallRunMaxFallSpeed (terminal velocity cap while wall-running)
    // SAFE RANGE: 1-6.
    wallGravity: 3.5,

    // Base "wish speed" — the target horizontal speed the game tries to
    // accelerate you toward when you press WASD on the ground. Sprint
    // multiplies this by sprintMult, so actual top running speed =
    // moveSpeed × sprintMult × (curse multiplier).
    // This is NOT a hard cap on horizontal speed — slides, parries, and
    // b-hops can all exceed it via momentum preservation.
    // INCREASE: faster baseline movement, easier to outrun monsters,
    //   but harder to navigate tight platforming sections.
    // DECREASE: more deliberate pace, easier platforming, but the game
    //   feels sluggish and the Mach meter rarely climbs past Mach 1.
    // INTERACTS WITH: sprintMult (final top speed = moveSpeed × sprintMult),
    //   groundAccel (how fast you reach this), airSpeedCap (air is capped
    //   much lower to enable strafe-jumping tech).
    // SAFE RANGE: 12-25.
    moveSpeed: 18.0,

    // Sprint multiplier applied to moveSpeed when Shift is held. Final
    // running speed = moveSpeed × sprintMult. So with defaults:
    //   - Walking speed: 18.0 u/s
    //   - Sprinting speed: 27.9 u/s
    // INCREASE: sprint feels more impactful, easier to build Mach speed.
    //   - At 2.0+, sprint dominates the game and walking feels useless
    // DECREASE: sprint feels like a small bump, walking is more viable.
    //   - At 1.0, sprint does nothing
    // INTERACTS WITH: moveSpeed (this is multiplied INTO it),
    //   sprintRampRate (how fast it engages).
    // SAFE RANGE: 1.3-1.9.
    sprintMult: 1.55,

    // How fast currentSprintMultiplier ramps toward sprintMult when Shift
    // is pressed. Higher = sprint engages instantly; lower = sprint "winds up".
    // Measured in lerp units per second (so 12 means roughly 95% engaged
    // in ~0.25 sec).
    // INCREASE: sprint feels instant and responsive.
    // DECREASE: sprint feels weighty, like a heavy character accelerating.
    //   - At 2, you can sprint for half a second before feeling the effect
    // INTERACTS WITH: sprintDecayRate (the symmetric decay rate).
    // SAFE RANGE: 6-20.
    sprintRampRate: 12.0,

    // How fast currentSprintMultiplier decays back to 1.0 when Shift is
    // released AND the player is on the ground. Air momentum is preserved
    // regardless of this value (only ground decay uses this).
    // INCREASE: sprint ends abruptly when you release Shift.
    // DECREASE: sprint momentum lingers, easier to chain into slides.
    //   - At 1, you keep most of your sprint speed for ~1 second after release
    // SAFE RANGE: 4-15.
    sprintDecayRate: 8.0,

    // =================================================================
    // 2. JUMP — vertical launch forces and feel
    // =================================================================

    // Base jump velocity applied to velocity.y on a grounded jump.
    // Max jump height = jumpForce² / (2 × gravity), so with defaults:
    //   19² / (2 × 24) = 7.5 units high.
    // This is the value the OTHER jump types multiply INTO:
    //   - Slide jump:  jumpForce × slideJumpMult
    //   - Double jump: jumpForce × doubleJumpMult
    //   - Parry fling: jumpForce × parryVerticalMult
    // INCREASE: every jump goes higher, easier to reach tall platforms.
    //   - At 25, the slide-jump clears 14-unit-tall walls easily
    //   - At 30+, jumps feel absurd (you can fly over the whole map)
    // DECREASE: jumps feel weaker, platforming is harder.
    //   - At 12, you can barely clear the 1.5x-scaled start platform
    // INTERACTS WITH: gravity (height = v²/2g — changing either matters),
    //   slideJumpMult, doubleJumpMult, parryVerticalMult (all multiply this).
    // SAFE RANGE: 14-24.
    jumpForce: 19.0,

    // Multiplier on jumpForce when jumping out of a slide. Slide-jumps
    // are the cornerstone of Grace/Ultrakill movement — they preserve
    // horizontal slide momentum AND give a bigger vertical pop.
    // Slide-jump height = (jumpForce × slideJumpMult)² / (2 × gravity).
    // INCREASE: slide-jumps launch you higher, easier to chain into another
    //   slide immediately. The defining movement tech feels stronger.
    //   - At 1.5, slide-jumps become the dominant way to traverse
    //   - At 2.0+, you can fly over entire obstacle patterns in one jump
    // DECREASE: slide-jumps feel like a small hop, less rewarding.
    //   - At 1.0, slide-jumps = regular jumps (loses the Grace feel)
    // INTERACTS WITH: jumpForce, slideMaxSpeed (need enough height to land
    //   on tall platforms you built up speed toward).
    // SAFE RANGE: 1.1-1.5.
    slideJumpMult: 1.3,

    // Multiplier on jumpForce when performing a double jump (air jump).
    // Double-jump height = (jumpForce × doubleJumpMult)² / (2 × gravity).
    // Set slightly ABOVE 1.0 so the second jump feels like a real reset,
    // not a half-hearted top-up.
    // INCREASE: double jumps give more height, easier to recover from
    //   bad jumps. At 1.5, the game becomes very forgiving.
    // DECREASE: double jumps feel weak. At 0.7, the double jump is barely
    //   a stutter-step and most players won't use it.
    // INTERACTS WITH: jumpForce, doubleJumpForwardKick (the horizontal
    //   kick that accompanies the double jump).
    // SAFE RANGE: 0.8-1.3.
    doubleJumpMult: 1.05,

    // Horizontal velocity added in the look direction when double-jumping.
    // Adds an Ultrakill-style "dash-jump" travel feel so the second jump
    // has horizontal movement, not just vertical.
    // The actual velocity added is bounded — it only kicks you up to this
    // speed if you're slower; if you're already faster (e.g. mid-b-hop),
    // it doesn't slow you down.
    // INCREASE: double jumps cover more horizontal distance, easier to
    //   cross gaps. At 20, double-jumps are a half-dash.
    // DECREASE: double jumps are nearly vertical. At 0, no horizontal kick.
    // SAFE RANGE: 0-15.
    doubleJumpForwardKick: 8.0,

    // Grace window (seconds) after walking off a ledge where a jump still
    // counts as "grounded". Lets you press jump a fraction of a second
    // late without falling.
    // INCREASE: more forgiving platforming. At 0.3, you can walk off a
    //   ledge and jump nearly a third of a second later — feels cheaty.
    // DECREASE: less forgiving. At 0.0, you must press jump exactly
    //   while grounded or you fall.
    // INTERACTS WITH: jumpBufferTime (the symmetric early-press window).
    // SAFE RANGE: 0.05-0.2.
    coyoteTime: 0.13,

    // Window (seconds) where pressing jump BEFORE landing still triggers
    // a jump the instant you touch the ground. Prevents "I pressed jump
    // but I was 1 frame too early so nothing happened" frustration.
    // INCREASE: more forgiving jump inputs, but at 0.3 you can pre-press
    //   jumps way too early and they still fire.
    // DECREASE: stricter timing. At 0, you must press jump exactly when
    //   grounded or it's ignored.
    // INTERACTS WITH: coyoteTime (the two together = forgiving platforming).
    // SAFE RANGE: 0.05-0.2.
    jumpBufferTime: 0.15,

    // Variable jump height: if the player releases Space while their
    // upward velocity is ABOVE this value, gravity is multiplied by
    // variableJumpGravityMult. This lets you do tiny hops by tapping
    // jump vs. full jumps by holding it.
    // INCREASE: variable jump height triggers later in the jump, so even
    //   short taps give high jumps. At 15, you basically can't do tiny hops.
    // DECREASE: variable jump height triggers earlier. At 1, even a full
    //   jump press gets cut if you release at the start.
    // INTERACTS WITH: variableJumpGravityMult (how hard the cut is).
    // SAFE RANGE: 2-8.
    variableJumpCutoffVel: 4.0,

    // Gravity multiplier applied when the player releases jump early
    // (see variableJumpCutoffVel). Higher = sharper cut, lower = gentler.
    // INCREASE: tap-jumps are tiny, hold-jumps are full height. Stronger
    //   variable height effect.
    // DECREASE: less difference between tap and hold jumps. At 1.0, there's
    //   no variable jump height at all.
    // SAFE RANGE: 1.3-2.5.
    variableJumpGravityMult: 1.8,

    // =================================================================
    // 3. WALL JUMP / WALL RUN — vertical wall movement
    // =================================================================

    // Upward velocity applied on a wall-jump. Independent of jumpForce so
    // wall-jumps can be tuned separately from regular jumps.
    // Wall-jump height = wallJumpForceUp² / (2 × gravity).
    // INCREASE: wall-jumps launch you higher, easier to climb walls.
    // DECREASE: wall-jumps feel weak, harder to wall-climb.
    // INTERACTS WITH: wallJumpForceSide (the lateral kick),
    //   wallJumpForwardBoost (the forward boost).
    // SAFE RANGE: 10-22.
    wallJumpForceUp: 16.0,

    // Lateral velocity added along the wall's normal (perpendicular to
    // the wall surface) when wall-jumping. This is what kicks you AWAY
    // from the wall.
    // INCREASE: wall-jumps throw you further from the wall, easier to
    //   cross gaps between walls. At 30, you can barely wall-climb because
    //   each kick throws you too far.
    // DECREASE: wall-jumps keep you close to the wall, easier to chain
    //   wall-jumps up the same wall.
    // INTERACTS WITH: wallJumpForceUp (total wall-jump trajectory is a
    //   vector sum of up + side).
    // SAFE RANGE: 10-25.
    wallJumpForceSide: 18.0,

    // Extra forward velocity added in the look direction on a wall-jump.
    // Lets you wall-jump UP a single wall and still move along it, instead
    // of just kicking away from it.
    // INCREASE: wall-jumps carry more forward momentum, good for speed-
    //   running up walls.
    // DECREASE: wall-jumps are more "straight up + away". At 0, you can
    //   only wall-jump perpendicular to walls.
    // SAFE RANGE: 0-8.
    wallJumpForwardBoost: 4.0,

    // Upward velocity set when first sticking to a wall (entering wall-run
    // state). Gives a small "pop" so you don't immediately start sliding
    // down the wall.
    // INCREASE: wall-run entry gives a noticeable upward boost. At 8, you
    //   can almost fly up walls by repeatedly entering wall-run.
    // DECREASE: wall-run entry is subtle. At 0, you start wall-running at
    //   whatever vertical velocity you had.
    // INTERACTS WITH: wallGravity, wallRunMaxFallSpeed (how fast you
    //   slide down once wall-running).
    // SAFE RANGE: 1-6.
    wallRunPopVel: 3.0,

    // Max downward velocity while wall-running. The wall-gravity pulls
    // you down, but this caps how fast you can fall while stuck to the
    // wall — keeps you on the wall longer.
    // Should be a small negative number (negative = downward).
    // INCREASE (toward 0): you hang almost motionless on walls. At 0,
    //   you don't slide down at all.
    // DECREASE (more negative): you slide down walls faster.
    //   At -10, wall-running barely helps — you drop fast.
    // INTERACTS WITH: wallGravity (which pulls you toward this cap).
    // SAFE RANGE: -3 to 0.
    wallRunMaxFallSpeed: -1.0,

    // Camera roll (in radians) applied while wall-running. The roll
    // direction is based on the wall's normal, so you lean INTO the wall.
    // 0.22 rad ≈ 12.6°. Adds the Ultrakill "wall-run lean" feel.
    // INCREASE: stronger camera lean. At 0.5, the camera tilts aggressively
    //   (can cause motion sickness).
    // DECREASE: subtler lean. At 0, no camera roll during wall-runs.
    // INTERACTS WITH: wallRunTiltLerp (how fast it transitions).
    // SAFE RANGE: 0.1-0.35.
    wallRunTiltAmount: 0.22,

    // How fast the camera roll approaches the target tilt while wall-
    // running (and back to 0 when leaving). Measured in lerp units/sec.
    // INCREASE: snappier camera tilt transitions.
    // DECREASE: smoother, more gradual camera tilt.
    //   At 2, the camera takes ~0.5s to fully tilt (feels laggy).
    // SAFE RANGE: 6-20.
    wallRunTiltLerp: 14.0,

    // =================================================================
    // 4. ACCELERATION — Quake/Source-style movement physics
    // =================================================================

    // Ground acceleration rate. How fast velocity approaches wishSpeed
    // (moveSpeed × sprintMult) when you press a movement key on the ground.
    // INCREASE: snappier ground control, instant direction changes.
    //   At 25, you can change direction instantly at full speed.
    // DECREASE: weightier ground movement, takes time to reach top speed.
    //   At 4, the game feels like controlling a heavy vehicle.
    // INTERACTS WITH: groundFriction (the symmetric slow-down rate),
    //   airAccel (the air equivalent, much higher but capped).
    // SAFE RANGE: 8-20.
    groundAccel: 14.0,

    // Friction applied to horizontal velocity when on the ground with no
    // movement input. Higher = stops faster; lower = slides further.
    // This is the Quake-style exponential decay: each frame, speed drops
    // by (speed × groundFriction × dt).
    // INCREASE: stops faster when you release keys. At 15, you stop on a dime.
    // DECREASE: slides further when you stop pressing keys. At 1, you slide
    //   for ~1 second after releasing — feels ice-skatey.
    //   IMPORTANT: doesn't apply during b-hops above wishSpeed (those use
    //   groundOverSpeedFriction instead, which is much gentler).
    // SAFE RANGE: 3-12.
    groundFriction: 6.0,

    // Air acceleration rate. Much higher than groundAccel, but the actual
    // speed added per frame is bounded by airSpeedCap × airAccel × dt.
    // The high value here is what makes air-strafing responsive — flick
    // the mouse + A/D and you feel the curve immediately.
    // INCREASE: air-strafing is more responsive, you can curve faster.
    // DECREASE: air-strafing feels sluggish, harder to build speed in air.
    // INTERACTS WITH: airSpeedCap (this is the multiplier; cap is the
    //   actual speed added per frame).
    // SAFE RANGE: 50-150.
    airAccel: 90.0,

    // The actual speed cap that air-accel can add per frame in the wish
    // direction. This is THE strafe-jump magic number — it's tiny so
    // holding W in the air barely adds speed, but turning the mouse + A/D
    // redirects your wishDir to be perpendicular to velocity, so the cap
    // applies to a NEW direction and ADDS to your total speed.
    // INCREASE: air-strafe gains are bigger but the strafe-jump TECHNIQUE
    //   becomes less important (any direction adds speed).
    //   At 5, holding W in air actually accelerates you — no strafe needed.
    // DECREASE: strafe-jumping gives smaller gains. At 0.5, only master-
    //   class strafe-jumpers will build any speed in the air.
    // INTERACTS WITH: airAccel (the multiplier on this),
    //   airSpeedSprintMult (sprint multiplier on this).
    // SAFE RANGE: 1.0-3.0. Outside this range, the strafe-jump tech breaks.
    airSpeedCap: 1.6,

    // Multiplier on airSpeedCap while sprint is held. Gives slightly more
    // generous air-strafe gains when sprinting.
    // INCREASE: sprinting in air gives bigger strafe gains.
    // DECREASE: sprinting in air gives no advantage. At 1.0, sprint has
    //   no effect on air strafing.
    // SAFE RANGE: 1.0-2.0.
    airSpeedSprintMult: 1.6,

    // Hard cap on total horizontal air speed. Only enforced when above
    // this limit — momentum below it is fully preserved (no decay).
    // Prevents runaway from parry flings, cube boosts, and chain slide-
    // jumps from launching you off the map.
    // INCREASE: higher top speeds possible. At 150, parry flings can
    //   yeet you across the map.
    // DECREASE: tighter speed cap. At 30, b-hops and parries feel weak
    //   because they immediately get clamped.
    // INTERACTS WITH: slideMaxSpeed (slides can exceed this briefly),
    //   parryBase + parryHSpeedMult + parryFallSpeedMult (parry formula
    //   is capped at airSpeedLimit × 1.15).
    // SAFE RANGE: 50-120.
    airSpeedLimit: 75.0,

    // =================================================================
    // 5. GROUND STEERING — "W follows camera" turn rate
    // (lets you turn your character with the mouse on the ground, even
    //  when moving faster than wishSpeed — without this, holding W does
    //  nothing when you're above the cap and you'd be forced to use A/D)
    // =================================================================

    // Turn rate (radians/second) at which velocity direction rotates
    // toward wishDir while grounded and at/below wishSpeed.
    // 9 rad/s ≈ 515°/s — fast enough for instant-feel direction changes.
    // INCREASE: ground turning feels more arcade-y, instant redirects.
    //   At 20, you can basically teleport-direction-change.
    // DECREASE: ground turning feels weightier. At 3, you have to plan
    //   turns in advance (like a vehicle).
    // INTERACTS WITH: groundSteerMinTurnRate (the rate at high over-speed).
    // SAFE RANGE: 5-15.
    groundSteerTurnRate: 9.0,

    // Turn rate (radians/second) when grounded but moving at 2× wishSpeed
    // or more. Lower than groundSteerTurnRate so b-hops survive — you
    // keep your speed but can't insta-redirect.
    // Linear interpolation between this and groundSteerTurnRate based on
    // how far over wishSpeed you are.
    // INCREASE: b-hops are more steerable. At 9 (same as base), no penalty.
    // DECREASE: b-hops are more committed to their direction. At 0, you
    //   can't steer at all while b-hopping (pure Quake feel).
    // SAFE RANGE: 2-6.
    groundSteerMinTurnRate: 3.0,

    // Speed bleed rate when grounded and moving above wishSpeed. Lets
    // b-hops survive a few frames on the ground before decaying.
    // Applied as: speed drops by (overspeed × groundOverSpeedFriction × dt)
    // per frame.
    // INCREASE: b-hops die faster when you touch the ground. At 5, landing
    //   kills your b-hop speed almost instantly.
    // DECREASE: b-hops survive longer on the ground. At 0.3, you can run
    //   on the ground at b-hop speed for ~1 second before slowing.
    //   At 0, you keep b-hop speed forever on the ground (broken).
    // SAFE RANGE: 0.8-3.0.
    groundOverSpeedFriction: 1.5,

    // =================================================================
    // 6. AIR STEERING — hybrid "W follows camera" in the air
    // (separate channel from Quake strafe-jumping — only kicks in when
    //  wishDir is roughly aligned with current velocity, so strafe-jumps
    //  still work)
    // =================================================================

    // Max turn rate (radians/second) at which velocity direction rotates
    // toward wishDir while airborne and aligned with current velocity.
    // 5.5 rad/s ≈ 315°/s — fast enough to feel responsive, slow enough
    // that you can't insta-180 in the air (which would break momentum).
    // INCREASE: air turning feels more responsive. At 15, you can nearly
    //   insta-redirect in the air (breaks the strafe-jump tech).
    // DECREASE: air turning feels sluggish. At 1, you can barely curve
    //   in the air with W + camera.
    // INTERACTS WITH: airSteerAlignThreshold (when this kicks in).
    // SAFE RANGE: 3-8.
    airSteerMaxRate: 5.5,

    // Alignment (dot product) above which air steering kicks in.
    // 0.25 = roughly 75° cone in front of your velocity vector.
    // Below this, the player is strafing or backpedaling — leave their
    // velocity alone so strafe-jumps stay pure.
    // INCREASE: air steering only kicks in when pushing nearly forward.
    //   At 0.9, you can only air-steer when holding W almost exactly
    //   forward — strafe-jumps get a wider window.
    // DECREASE: air steering kicks in even when strafing. At 0, air
    //   steering always runs (kills strafe-jump tech).
    // SAFE RANGE: 0.15-0.5.
    airSteerAlignThreshold: 0.25,

    // =================================================================
    // 7. SLIDE — the cornerstone of Grace/Ultrakill movement
    // =================================================================

    // Base slide duration in seconds. Slide auto-ends when this runs out
    // (or when slide speed drops too low, or when you release the slide key).
    // INCREASE: slides last longer, more time to chain into slide-jumps.
    //   At 3.0, slides carry you across huge distances.
    // DECREASE: slides are short bursts. At 0.5, slides barely do anything.
    // INTERACTS WITH: slideFriction (slides can end early if friction
    //   kills speed first), slideDecayExponent (how speed tapers).
    // SAFE RANGE: 0.8-2.5.
    slideDuration: 1.6,

    // Base slide boost speed. When you start a slide, your horizontal
    // velocity is set to (current speed × slideBoostFromSpeedMult) +
    // slideInitialSpeed, capped at slideMaxSpeed.
    // This is the MINIMUM boost you get from sliding, even from a standstill.
    // INCREASE: slides always give a big speed boost. At 60, you can slide
    //   from a standstill and immediately be at Mach 3.
    // DECREASE: slides require existing momentum to be useful.
    //   At 10, slides from a standstill are barely faster than walking.
    // INTERACTS WITH: slideBoostFromSpeedMult (the multiplier on existing
    //   speed), slideMaxSpeed (the cap).
    // SAFE RANGE: 25-50.
    slideInitialSpeed: 38.0,

    // Hard cap on slide boost speed. No matter how much momentum you had,
    // the slide boost won't exceed this.
    // INCREASE: chain slide-jumps can build more speed. At 120, you can
    //   get going absurdly fast.
    // DECREASE: slides are capped at a lower top speed. At 40, slides feel
    //   uniform regardless of input speed.
    // INTERACTS WITH: airSpeedLimit (slides can briefly exceed this; once
    //   you jump, airSpeedLimit takes over).
    // SAFE RANGE: 60-100.
    slideMaxSpeed: 80.0,

    // Multiplier on current horizontal speed when computing slide boost.
    // Boost = (current speed × this) + slideInitialSpeed, capped at
    // slideMaxSpeed.
    // INCREASE: chaining slide-jump-slide ramps up speed faster.
    //   At 2.5, two chained slides max out at slideMaxSpeed.
    // DECREASE: slide boost is more uniform regardless of input speed.
    //   At 0.5, slides barely scale with your existing momentum.
    // INTERACTS WITH: slideInitialSpeed (the base boost).
    // SAFE RANGE: 1.0-2.0.
    slideBoostFromSpeedMult: 1.5,

    // Friction applied DURING a slide. Lower = slides hold speed longer.
    // Applied as Quake-style exponential decay: speed drops by
    // (speed × slideFriction × dt) per frame.
    // INCREASE: slides decelerate faster, shorter effective duration.
    //   At 4, slides barely last a second before dying.
    // DECREASE: slides hold speed longer, almost no deceleration.
    //   At 0.1, slides never seem to end (you slide forever).
    // SAFE RANGE: 0.3-2.0.
    slideFriction: 0.9,

    // Cooldown (seconds) between slides. Prevents slide-jump-slide-jump
    // spam from infinitely stacking velocity.
    // INCREASE: longer gap between slides, harder to chain slide-jumps.
    //   At 0.5, slide-jumping feels sluggish.
    // DECREASE: snappier slide recovery, easier to chain. At 0, you can
    //   slide-jump-slide-jump with no gap (but physics still prevents
    //   infinite velocity stacking via the slide boost cap).
    // SAFE RANGE: 0.05-0.3.
    slideCooldown: 0.12,

    // How much current key input curves a slide. Higher = more steerability
    // mid-slide; lower = slides hold their line tighter.
    // INCREASE: slides are more steerable. At 10, you can curve slides
    //   around obstacles easily.
    // DECREASE: slides commit to their initial direction. At 0, slides
    //   go in a straight line and you can't steer at all.
    // INTERACTS WITH: slideSteerLerp (how fast the slide velocity blends
    //   toward the new direction).
    // SAFE RANGE: 2-8.
    slideSteerInfluence: 4.5,

    // How fast slide velocity blends toward the new direction (steered
    // by input). Higher = snappier steering response.
    // INCREASE: slide steering feels more responsive.
    // DECREASE: slide steering feels mushy, like turning a boat.
    // INTERACTS WITH: slideSteerInfluence (the magnitude of steering).
    // SAFE RANGE: 2-8.
    slideSteerLerp: 4.5,

    // Exponent on the slide speed decay curve. Lower = speed holds flatter
    // longer before tailing off at the end.
    // At 1.0, linear decay (constant deceleration).
    // At 2.0, speed drops sharply at the start then levels out.
    // INCREASE: slides lose speed faster at the start, hold less throughout.
    // DECREASE: slides hold speed longer before dropping off.
    //   At 0.5, slides maintain top speed almost to the end then drop.
    // SAFE RANGE: 0.8-2.0.
    slideDecayExponent: 1.2,

    // Initial downward velocity applied when starting a slide in mid-air
    // (a "dive" / Grace slam). Negative = downward.
    // INCREASE (more negative): dives slam down faster. At -50, dives
    //   feel like meteor strikes.
    // DECREASE (toward 0): dives are gentler. At 0, mid-air slides don't
    //   slam you down at all.
    // INTERACTS WITH: parryFallSpeedMult (faster fall = bigger parry fling
    //   — dives synergize with parries for huge horizontal launches).
    // SAFE RANGE: -15 to -40.
    diveSlamSpeed: -26.0,

    // Gravity multiplier while dive-sliding (sliding in mid-air). Dives
    // get heavier gravity so they actually slam down instead of floating.
    // INCREASE: dives slam down harder and faster.
    // DECREASE: dives feel more like normal falling. At 1.0, dives are
    //   just regular slides in mid-air (no slam feel).
    // SAFE RANGE: 1.3-2.5.
    diveGravityMult: 1.9,

    // =================================================================
    // 8. CUBE PARRY FLING — the reward for collecting cubes
    // =================================================================

    // Base launch magnitude when collecting a cube. The parry fling
    // formula is:
    //   launch = parryBase + (currentHSpeed × parryHSpeedMult) + (fallSpeed × parryFallSpeedMult)
    //   (capped at airSpeedLimit × 1.15)
    // INCREASE: every cube collection gives a bigger fling. At 100, the
    //   game becomes a pinball machine.
    // DECREASE: cube flings are smaller, more controlled. At 20, parries
    //   feel weak.
    // INTERACTS WITH: parryHSpeedMult, parryFallSpeedMult (the scalars
    //   on current speed and fall speed).
    // SAFE RANGE: 35-80.
    parryBase: 55.0,

    // Multiplier on current horizontal speed when computing parry fling.
    // Rewards collecting cubes while moving fast.
    // INCREASE: faster collection = bigger fling. At 3.0, Mach 4 collection
    //   gives an enormous launch.
    // DECREASE: parry flings are more uniform regardless of input speed.
    //   At 0.5, parries are basically a flat boost.
    // SAFE RANGE: 1.0-2.5.
    parryHSpeedMult: 1.8,

    // Multiplier on fall speed (downward velocity) when computing parry
    // fling. Rewards DIVING into cubes — diving builds up fall speed,
    // which gets converted into a massive horizontal launch.
    // INCREASE: diving into cubes gives HUGE flings. At 25, dive-parries
    //   are the dominant strategy.
    // DECREASE: diving into cubes is less rewarding. At 0, fall speed
    //   doesn't affect the parry at all.
    // INTERACTS WITH: diveSlamSpeed (dives build up fall speed quickly),
    //   parryVerticalMult (the vertical component of the parry).
    // SAFE RANGE: 5-20.
    parryFallSpeedMult: 12.0,

    // Multiplier on jumpForce for the vertical component of the parry fling.
    // Parry vertical launch = jumpForce × parryVerticalMult.
    // INCREASE: parries launch you higher, easier to chain into another
    //   slide-jump after a parry.
    // DECREASE: parries are more horizontal. At 0.5, parries barely lift
    //   you off the ground.
    // INTERACTS WITH: jumpForce (this multiplies into it).
    // SAFE RANGE: 1.0-2.0.
    parryVerticalMult: 1.6,

    // =================================================================
    // 9. LOOK / MOUSE — camera control
    // =================================================================

    // Base mouse sensitivity scalar. Multiplied by the user's sensitivity
    // slider setting (default 1.0) to get the actual yaw/pitch delta per
    // pixel of mouse movement.
    // INCREASE: mouse feels more sensitive at all speeds.
    // DECREASE: mouse feels less sensitive at all speeds.
    // INTERACTS WITH: speedLookMultMax, speedLookMultDivisor (the speed-
    //   scaling multiplier applied on top of this).
    // SAFE RANGE: 0.001-0.005.
    baseMouseSens: 0.002,

    // Additional sensitivity added per curseFactor point. The curse system
    // ramps up difficulty over time, and this makes the mouse slightly
    // more sensitive as the curse builds (adds to the chaotic feel).
    // INCREASE: curse has a bigger effect on mouse sensitivity.
    // DECREASE: curse has less effect on mouse sensitivity. At 0, curse
    //   doesn't affect mouse at all.
    // SAFE RANGE: 0-0.002.
    curseMouseSensAdd: 0.0008,

    // Max additional mouse sensitivity multiplier at top speed. The actual
    // multiplier is 1.0 + min(hSpeed / speedLookMultDivisor, this).
    // At top speed, mouse sensitivity is multiplied by (1.0 + this).
    // Default 1.4 = up to 2.4× sensitivity at Mach 4.
    // This compensates for the fact that at high speed, the same mouse
    // movement barely rotates your view relative to how fast the world
    // is flying past.
    // INCREASE: high-speed turning feels more responsive. At 2.5, Mach 4
    //   turning is hypersensitive (can be nauseating).
    // DECREASE: high-speed turning feels less responsive. At 0, no speed
    //   scaling — high-speed turning is sluggish (the original problem).
    // INTERACTS WITH: speedLookMultDivisor (how fast the mult ramps up).
    // SAFE RANGE: 0.8-2.0.
    speedLookMultMax: 1.4,

    // Divisor on horizontal speed for the speed-look multiplier. The
    // multiplier ramps from 1.0 (at hSpeed=0) to 1.0+speedLookMultMax
    // (at hSpeed=speedLookMultDivisor).
    // Default 50 = full multiplier at Mach 2-3 (~50 u/s).
    // INCREASE: speed-look mult ramps up slower. At 100, you need Mach 4
    //   for full effect.
    // DECREASE: speed-look mult ramps up faster. At 20, even walking speed
    //   gives a noticeable sensitivity boost.
    // INTERACTS WITH: speedLookMultMax (the cap).
    // SAFE RANGE: 30-80.
    speedLookMultDivisor: 50,

    // =================================================================
    // 10. FOV — field of view dynamic adjustments
    // =================================================================

    // Max FOV (degrees) added by the sprint multiplier. The actual added
    // FOV is lerped between 0 and this based on
    // (currentSprintMultiplier × cubeBoostMult - 1.0) / 1.9.
    // INCREASE: sprint widens FOV more dramatically.
    // DECREASE: sprint has less effect on FOV. At 0, no FOV change on sprint.
    // INTERACTS WITH: fovMax (hard cap on total FOV).
    // SAFE RANGE: 15-30.
    fovSprintBoost: 23,

    // FOV added while sliding. Gives the "speed-rush" feel when you slide.
    // INCREASE: slides widen FOV more.
    // DECREASE: slides have less FOV effect.
    // SAFE RANGE: 10-25.
    fovSlideBoost: 18,

    // Max FOV added by raw horizontal speed. The speed-FOV ramps from 0
    // (at hSpeed=fovSpeedStartSpeed) to this (at hSpeed=fovSpeedStartSpeed +
    // fovSpeedRange).
    // INCREASE: high speed widens FOV more dramatically (tunnel vision at
    //   Mach 4).
    // DECREASE: high speed has less FOV effect.
    // INTERACTS WITH: fovSpeedStartSpeed, fovSpeedRange.
    // SAFE RANGE: 10-25.
    fovSpeedBoost: 18,

    // Horizontal speed at which the speed-FOV starts ramping up. Below
    // this, no speed-based FOV change.
    // INCREASE: speed-FOV only kicks in at higher speeds.
    // DECREASE: speed-FOV kicks in at lower speeds. At 0, even walking
    //   widens the FOV.
    // INTERACTS WITH: fovSpeedRange, fovSpeedBoost.
    // SAFE RANGE: 10-25.
    fovSpeedStartSpeed: 18,

    // Range of horizontal speed over which the speed-FOV ramps from 0 to
    // fovSpeedBoost. Full FOV boost is reached at
    // (fovSpeedStartSpeed + fovSpeedRange).
    // INCREASE: speed-FOV ramps up more gradually over a wider speed range.
    // DECREASE: speed-FOV snaps on over a narrow speed range.
    // SAFE RANGE: 40-80.
    fovSpeedRange: 60,

    // Hard cap on FOV. Without this, sprint + slide + cube boost + curse
    // can stack FOV past 150°, which looks broken and causes motion sickness.
    // INCREASE: higher max FOV allowed (can cause motion sickness).
    // DECREASE: lower max FOV (less dramatic speed-rush feel).
    //   At 90, FOV never changes — feels flat.
    // SAFE RANGE: 100-125.
    fovMax: 115,

    // How fast the camera FOV approaches the target FOV (lerp units per
    // second). Higher = snappier FOV transitions.
    // INCREASE: FOV changes feel instant.
    // DECREASE: FOV changes feel smooth and gradual. At 2, FOV lags behind
    //   speed changes noticeably.
    // SAFE RANGE: 5-15.
    fovLerpRate: 10,

    // FOV added per curseFactor point. The curse system widens FOV as it
    // ramps up, adding to the chaotic feel.
    // INCREASE: curse has a bigger FOV effect.
    // DECREASE: curse has less FOV effect. At 0, no curse FOV change.
    // SAFE RANGE: 0-25.
    fovCurseBoost: 15,

    // =================================================================
    // 11. MACH METER — speed-o-meter UI thresholds
    // =================================================================

    // Horizontal speed (u/s) at which the Mach meter shows "MACH 1".
    // INCREASE: Mach 1 requires higher speed.
    // DECREASE: Mach 1 triggers at lower speeds.
    // INTERACTS WITH: mach2Speed, mach3Speed, mach4Speed (must be in
    //   ascending order).
    // SAFE RANGE: 8-20.
    mach1Speed: 14,

    // Horizontal speed at which the Mach meter shows "MACH 2".
    // SAFE RANGE: 18-35. Must be > mach1Speed.
    mach2Speed: 28,

    // Horizontal speed at which the Mach meter shows "MACH 3".
    // SAFE RANGE: 30-55. Must be > mach2Speed.
    mach3Speed: 45,

    // Horizontal speed at which the Mach meter shows "MACH 4".
    // Default 65 ≈ slide-jump top speed.
    // SAFE RANGE: 50-80. Must be > mach3Speed.
    mach4Speed: 65,

    // Horizontal speed at which the speed bar is 100% full.
    // INCREASE: bar fills slower, more headroom for top speeds.
    // DECREASE: bar fills faster, maxes out earlier.
    // SAFE RANGE: 60-100.
    speedOMeterMax: 80,

    // Max text scale pulse at full speed. The Mach text scales up by
    // (1.0 + (speedPercent / 100) × this).
    // INCREASE: Mach text pulses more dramatically at high speed.
    // DECREASE: Mach text pulse is subtler. At 0, no pulse.
    // SAFE RANGE: 0.05-0.3.
    machPulseMax: 0.15,

    // =================================================================
    // 12. CAMERA BOB — head bobbing for sense of motion
    // =================================================================

    // Vertical head bob amplitude (units). The camera bobs up/down by
    // this much when walking/running.
    // INCREASE: more pronounced vertical bob, stronger sense of motion.
    //   At 0.15, can cause motion sickness.
    // DECREASE: subtler bob. At 0, no vertical head bob.
    // SAFE RANGE: 0.03-0.1.
    bobAmountY: 0.06,

    // Horizontal head bob amplitude (units). The camera sways left/right
    // by this much when walking/running.
    // INCREASE: more pronounced horizontal sway.
    // DECREASE: subtler sway.
    // SAFE RANGE: 0.02-0.06.
    bobAmountX: 0.04,

    // Camera Y offset (units) while sliding. Negative = camera drops.
    // Gives the "crouch into slide" feel.
    // INCREASE (toward 0): less camera drop on slide.
    // DECREASE (more negative): more camera drop. At -0.5, slides feel
    //   like you're laying on the ground.
    // SAFE RANGE: -0.4 to 0.
    slideCameraDrop: -0.2,

    // =================================================================
    // 13. PLAYER — collision and spawn
    // =================================================================

    // Player eye height above feet (units). Determines camera Y offset
    // when grounded. Sliding cuts this in half (camera drops to half height).
    // INCREASE: player feels taller, camera higher off the ground.
    //   Affects collision (player capsule is taller).
    // DECREASE: player feels shorter, camera lower to the ground.
    // INTERACTS WITH: spawnY (must be platform top + playerHeight + small fall).
    // SAFE RANGE: 1.5-2.2.
    playerHeight: 1.8,

    // Player horizontal collision radius (units). Used for obstacle AABB
    // collision checks — the AABB is expanded by this on X/Z.
    // INCREASE: player collides with obstacles from further away (feels
    //   "fatter"). At 1.0, you can't fit through narrow gaps.
    // DECREASE: player can squeeze through narrower gaps. At 0.1, you can
    //   clip through thin walls.
    // SAFE RANGE: 0.3-0.6. Lower than 0.3 = tunneling risk.
    playerRadius: 0.4,

    // Initial spawn Y (units). Player spawns at this height above y=0.
    // Must be above the start platform top (startPlatformHeight) +
    // playerHeight, so the player spawns ABOVE the platform and falls
    // onto it. Otherwise they spawn inside the platform.
    // Default: 1.5 (platform) + 1.8 (height) + 0.5 (fall) = 3.8.
    // INCREASE: spawn higher above platform (longer initial fall).
    // DECREASE: spawn lower. Below 3.3, you spawn INSIDE the platform.
    // INTERACTS WITH: startPlatformHeight, playerHeight.
    // SAFE RANGE: 3.3-5.0.
    spawnY: 3.8,

    // =================================================================
    // 14. PHYSICS SAFETY — anti-tunneling substepping
    // =================================================================

    // Max distance the player is allowed to move per collision substep.
    // Anything faster in one frame gets split into multiple substeps so
    // thin walls/platforms can't be skipped over (tunneling).
    // INCREASE: fewer substeps needed (faster physics), but higher
    //   tunneling risk. At 1.0, you can tunnel through thin walls at
    //   Mach 4.
    // DECREASE: more substeps (slower physics, but no tunneling). At 0.1,
    //   the physics loop gets expensive.
    // INTERACTS WITH: maxSubsteps (hard cap on substep count).
    // SAFE RANGE: 0.2-0.6.
    maxSubstepDist: 0.4,

    // Hard cap on collision substeps per frame. Prevents the physics loop
    // from running forever if velocity is absurdly high.
    // INCREASE: more substeps allowed, less tunneling at extreme speeds,
    //   but worse performance at high speed.
    // DECREASE: fewer substeps, better performance, but more tunneling risk.
    //   At 4, Mach 4 slides can tunnel through walls.
    // INTERACTS WITH: maxSubstepDist, slideMaxSpeed (need enough substeps
    //   to cover the slide max speed per frame).
    // SAFE RANGE: 8-16.
    maxSubsteps: 12,

    // =================================================================
    // 15. OBSTACLES — size, color, texture tiling
    // =================================================================

    // Global obstacle size multiplier. Applied to every obstacle pattern's
    // width, height, depth, AND position (so pieces stay properly spaced
    // relative to each other).
    // INCREASE: bigger obstacles, more spacing between pieces within a
    //   pattern, easier platforming.
    //   At 2.0+, the map starts feeling empty (patterns are far apart).
    // DECREASE: smaller obstacles, tighter patterns.
    //   At 0.5, obstacles are tiny and patterns overlap each other.
    // INTERACTS WITH: obstacleMinDistBetween (scaled by this),
    //   startPlatformSize (should be scaled proportionally for consistency).
    // SAFE RANGE: 1.0-2.0.
    obstacleSizeMult: 1.5,

    // Color multiplier applied to obstacle textures. Multiplies the RGB
    // of the texture by this color, so darker colors dim the texture.
    // 0x3a4452 = dark slate blue-grey (keeps obstacles muted so red cubes pop).
    // Use 0xffffff for full-bright textures.
    // INCREASE (toward 0xffffff): obstacles get brighter, more visible,
    //   but compete with red cubes for visual attention.
    // DECREASE (darker): obstacles recede into the background, cubes pop more.
    //   At 0x000000, obstacles are invisible (broken).
    // SAFE RANGE: 0x202838 to 0x808898.
    obstacleTint: 0x3a4452,

    // World units per texture tile on obstacle faces. Lower = more texture
    // repeats per face (denser pattern); higher = fewer repeats (stretched).
    // INCREASE: obstacle textures look stretched/compressed.
    // DECREASE: obstacle textures look denser/more repeated.
    //   At 1, every brick/stone is huge on the face.
    // SAFE RANGE: 2-8.
    obstacleTileWorldSize: 4,

    // Anisotropic filtering level for obstacle textures. Higher = sharper
    // at grazing angles (e.g. looking along a wall surface).
    // INCREASE: textures sharper at grazing angles, but uses more GPU memory.
    // DECREASE: textures blurrier at grazing angles.
    //   At 1, no anisotropic filtering (textures shimmer at distance).
    // SAFE RANGE: 4-16. Most GPUs cap at 8 or 16.
    obstacleTextureAniso: 8,

    // Base minimum distance between pattern centers when generating
    // obstacles. Scaled by obstacleSizeMult to keep patterns from
    // overlapping as they get bigger.
    // INCREASE: patterns spread further apart, more empty space on the map.
    // DECREASE: patterns closer together, denser obstacle field.
    //   At 50, patterns constantly overlap and clip into each other.
    // INTERACTS WITH: obstacleSizeMult (final min distance = this × sizeMult).
    // SAFE RANGE: 150-300.
    obstacleMinDistBetween: 200,

    // =================================================================
    // 16. GROUND — color and texture tiling of the floor
    // =================================================================

    // Color multiplier applied to the grass texture. Multiplies the RGB
    // of the grass texture, so darker colors dim the grass.
    // 0x4a5238 = dark olive (grass detail visible but muted).
    // Use 0xffffff for full-bright grass.
    // INCREASE (toward 0xffffff): grass gets brighter, more saturated,
    //   draws more visual attention (can compete with cubes).
    // DECREASE (darker): grass recedes into the background, cubes pop more.
    //   At 0x000000, ground is invisible (broken).
    // SAFE RANGE: 0x303828 to 0x90a080.
    groundTint: 0x4a5238,

    // Grass texture tile count across the map. Higher = more repeats,
    // smaller tiles (denser grass detail); lower = fewer repeats, larger
    // tiles (stretched grass).
    // INCREASE: grass texture tiles more densely. At 250, individual
    //   grass blades are hard to see.
    // DECREASE: grass texture stretches. At 30, the grass looks muddy
    //   and pixelated.
    // INTERACTS WITH: MAP_SIZE (constant 2000 — tile size = MAP_SIZE / this).
    // SAFE RANGE: 80-200.
    grassTileRepeat: 125,

    // =================================================================
    // 17. START PLATFORM — the platform the player spawns on
    // =================================================================

    // Start platform width and depth (units). The platform is square,
    // so this is used for both X and Z dimensions.
    // INCREASE: bigger spawn area, more room to orient before exploring.
    //   At 50, the start platform dominates the center of the map.
    // DECREASE: smaller spawn area. At 10, you can fall off easily while
    //   getting your bearings.
    // INTERACTS WITH: startPlatformHeight, obstacleSizeMult (should be
    //   scaled proportionally).
    // SAFE RANGE: 20-40.
    startPlatformSize: 30,

    // Start platform height (units). The platform top is at this Y value.
    // Player spawns at spawnY, which must be > this + playerHeight.
    // INCREASE: taller start platform, player spawns higher.
    //   Must increase spawnY to match (spawnY = this + playerHeight + fall).
    // DECREASE: shorter start platform.
    // INTERACTS WITH: spawnY (must be > this + playerHeight).
    // SAFE RANGE: 1.0-2.5.
    startPlatformHeight: 1.5,

    // Start platform color (hex). Visible as the platform's surface color
    // (before texture tint is applied).
    // 0x888888 = medium grey.
    // Use any hex color — 0xff0000 = red, 0x00ff00 = green, etc.
    // SAFE RANGE: any valid hex color.
    startPlatformColor: 0x888888,
};

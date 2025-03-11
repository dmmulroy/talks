# Outline
- The problem with TypeScript - ✅
- Qualities of “production software” (imo) - ✅
- Why we’re betting on Effect - ✅
- The power of an Error - ✅
- TLD Metadata Sync & TLD Price Cache (maybe subcriber-domains-registrar) - 🟨
- Domains Search/Buy - 
- Useful Patterns - ✅
- Takeaways & the future - ✅

// Meme Recall 
# The problem with TypeScript
## Honorable mentions
- **`unknown` Errors**
```TypeScript
function getDnsRecords(dnsZone: string): Promise<DnsRecord[]> {}

class DnsPropogationDelayError extends Error {}
class DnsZoneNotFoundError extends Error {}
class InvalidDnsZoneError extends Error {}

function handler(req, res) {
    try {
    // ... 
    const dnsRecords = await getDnsRecords("v0.dev")
    //...
    } catch (error) {
        //   ^? `unknown`
    }
}
```
- **Function Coloring**: // Ryan Winchester Meme & QuanSync (https://antfu.me/posts/async-sync-in-between)
- **Package Cohesion**  : We don't have our version of Rails, Laravel, or Spring Boot
  - Libraries and packages are not built to work together or with similar design goals
  - In large code bases this can result in reinventing the wheel many times over (poorly) 
  - Sindre Sorhus is carrying the ecosystem in his backpack

# Qualities of “production software” (imo)

- **Predictable:** Consistent operation, error handling, and recovery.
- **Obersvable:** Easy troubleshooting with telemetry and logging.
- **Refactorable:** Simple feature additions and modifications.
- **Testable:** Meaningful tests are easily implemented.
- **Intuitive:** Abstractions guide developers towards best practices.
- **Scalable:** Architecturally and organizationally.

# Qualities of “production software” (imo)

- These traits and properties are deceivingly hard to acheive in TypeScript
- Teams and organizations require a high degree of discipline 
- Unfortunately, scaling discipline doesn't work well

#  Qualities of “production software” (imo) / consulting
- Fortunate 500's
- Start ups
- FAANGs

Regardless of organization or team size, the skill level of the engineers, or 
the type of product being built. I have yet to see TypeScript scale in maintainable
way at the people & process level.

# Why we're betting on Effect

tl;dr: It makes doing the hard and tedious things that require discipline easy first class

- **Predictable:** Effect<Success, Failure, Requirements>
```typescript
type UpstreamRegistrarService = {
    getPrice: (
      domain: string,
      options: Readonly<{
        period: number | 'all';
        registrationType: RegType;
      }>,
    ) =>
      Effect.Effect<
        GetPriceResponse,
        UnexpectedUpstreamRegistrarError | ExecuteApiCommandError,
        UpstreamRegistrarClient
      >;
}
```
- **Composable & Typed Error Tracking:** 
```typescript
function queryDomain(domainName: string): Effect.Effect<Domain, DomainNotFoundError>
function enrichDomain(domain: Domain): Effect.Effect<EnrichedDomain, EnrichmentError>
function renewDomain(enrichedDomain: EnrichedDomain): Effect.Effect<RenewedDomain, RenewalFailure>

function renewDomainAction(domainName: string) {
  return Effect.gen(function* () {
    const domain = yield* queryDomain(domainName);
    const enrichedDomain = yield* enrichDomain(domain);
    const renewedDomain = yield* renewDomain(enrichedDomain)

    return renewedDomain;
  })
}

function renewDomainAction(domainName: string): Effect.Effect<
  RenewedDomain, 
  DomainNotFoundError | EnrichmentError | RenewalFailure
>
```

- **Dependency Injection:** Layer<ProvidedType, Failure, Requirements>
```typescript
// TODO: Use Layers
function getCachedDomainPrice(domainName: string) {
    return Effect.gen(function* () {
        const cache = yield* PriceCache;
        const price = cache.get(domainName);

        return price;
    });
}

function production() {
    return Effect.gen(function* () {
        const cachedPrice = yield* getCachedDomainPrice('v0.dev');
    }).pipe(Effect.provide(PriceCache.Redis));
}

function testing() {
    return Effect.gen(function* () {
        const cachedPrice = yield* getCachedDomainPrice('v0.dev');
    }).pipe(Effect.provide(PriceCache.InMemory));
}
```

- **Observability**: `Effect.withSpan('upstream_registrar.sync')`
```typescript
export const syncTlds = (tlds: Tld[]) => {
  return Effect.gen(function* () {
    // ... implementation ...
  }).pipe(
    Effect.withSpan('upstream_registrar.sync_tlds', {
      attributes: {
        tlds,
      },
    }),
  );
};
```
// TODO: Screenshot of traces

- **Structured Concurrency** 
// TODO: Code Sample 

- **Harmony**
// TODO: Reference most recent Effect podcast w/ MarkPrompt
- Composability across all parts of the system
  - Schema
  - Retries
  - Error Handling
  - Concurrency

# Case Study | Rethinking Vercel Domains with Effect

## Timeline

- **December:** TLD Metadata Service(s)
- **January:** TLD Price Cache
- **February:** Domains Search/Buy/Availability Service()
- **March:** Domains Search/Buy/Availability Service() 

## The actual timeline
- **December:** TLD Metadata Service(s) (start)
- **December:** Refactor Availability + Buy endpoints to support urgent Billing/Money initiative
- **January:** Self Serve Renewals & Redemptions + Upstream Registrar Provider Integration Improvements
- **February:** Domains Team becomes official - onboaring + ramp up
- **March:** TLD Price Cache + Metadata Service, Search/Buy Planning and Kick Off
// TODO: Alien Meme Guy "Timelines"

Despite my ambitions of presenting what I hoped would be a suite of new Effect services,
we did find use cases for Effect along the way, albeit not in ways that I thought we would.

# Case Study | The power of an Error

// TODO: Image of changelog for self-serve
## Extracting & Refactoring Domain Renewals to support Self-Serve
- Domains had the highest amount of CSE tickets next to Billing
- 3 Error Types, very little if any telemetry and logging, one off retries
- 17 Error Types, each with it's own context, retryablility, internal error messages, and client error messages 
- Huge reduction in CSE tickets - used `Data.TaggedError` + `neverthrow` 
- Increase in the speed to resolve bugs, issues, support tickets
- Improved telemetry, observability, and tracing

// TODO: Trace Screenshot

# Case Study | TLD Metadata Sync & TLD Price Cache

// TODO: Wix Engineering Error Image

# Case Study | Domains Search & Buy



# Case Study | Useful Patterns
// TODO: Shoutout Atilla from ZenDesk

- `neverthrowToEffect`
```typescript
/**
 * Converts a `Result` from the `neverthrow` library into an `Effect`.
 *
 * This function transforms a `Result<A, E>` into an `Effect.Effect<A, E, never>` by pattern matching
 * on the result. If the `Result` is a success, it creates a succeeding `Effect` with the value.
 * If the `Result` is an error, it creates a failing `Effect` with the error.
 *
 * @template A - The type of the success value.
 * @template E - The type of the error.
 *
 * @param {Result<A, E>} result - The `Result` to convert into an `Effect`.
 * @returns {Effect.Effect<A, E, never>} The resulting `Effect` representing either success or failure.
 */
export function neverthrowResultToEffect<A, E>(
  result: Result<A, E>,
): Effect.Effect<A, E> {
  return result.match(Effect.succeed, Effect.fail);
}
```

- `WrappedService` type
```typescript
export type WrappedService<Service, Failure> = Readonly<{
  service: Service;
  use: <Success>(
    fn: (service: Service) => Promise<Success>,
  ) => Effect.Effect<Success, Failure>;
}>;
```
// TODO: Find Example


- `effectToPromiseSettledResult`
```typescript
/**
 * Converts an Effect into a `PromiseSettledResult`.
 *
 * Runs the provided Effect using the given runtime and converts the result
 * into a settled promise result. If the effect succeeds, it returns a fulfilled
 * result. If it fails, the error is squashed and returned as a rejected result.
 *
 * @param {ManagedRuntime.ManagedRuntime<R, E>} runtime - The Effect runtime to execute within.
 * @returns A function that takes an effect and returns a settled promise result.
 */
// TODO: s/ManagedRuntime/Runtime/g
export const effectToPromiseSettledResult =
  (runtime: Runtime.Runtime<never>) =>
  async <Success>(
    effect: Effect.Effect<Success>,
  ): Promise<PromiseSettledResult<Success>> => {
    return runtime.runPromiseExit(effect).then((exit) => {
      if (Exit.isSuccess(exit)) {
        return PromiseSettledResult.succeed(exit.value);
      }

      return PromiseSettledResult.fail(Cause.squash(exit.cause));
    });
  };
```

- `createDualFn`
```typescript
/**
 * Creates a function that can be called with two arguments or partially applied with one argument.
 *
 * This utility allows a function to be used in both curried and standard invocation styles.
 *
 * @param {function(First, Second): A} fn - The function to transform into a dual API function.
 * @returns A function that can be called either with both arguments at once or partially applied with the second argument first.
 */
export const createDualApiFn = <First, Second, A>(
  fn: (first: First, second: Second) => A,
): {
  (first: First, second: Second): A;
  (second: Second): (first: First) => A;
} => {
  return dual(2, fn);
};
```
// TODO: https://x.com/dillon_mulroy/status/1897076497858617568 - show example of how to use

- `withInstrumentation`
```typescript
import { Effect, type Schedule } from 'effect';
import flatten from 'flat';
import { isError } from 'effect/Predicate';
import type { AnySpan, SpanKind, SpanLink } from 'effect/Tracer';
import { Retry } from './retry';

type SpanType = 'web' | 'db' | 'cache' | 'function' | 'custom';

withInstrumentation("span.name", {})
/**
 * Configuration options for instrumentation.
 *
 * These options define attributes, logging, retry policies, and span configurations
 * for tracing execution using Effect.
 */
export type InstrumentationOptions = Readonly<{
  /** Additional attributes to annotate spans with. */
  annotateSpansWith?: Record<PropertyKey, unknown>;

  /** Attributes to attach to the span. */
  attributes?: Record<PropertyKey, unknown>;

  /**
   * Whether stack traces should be captured for spans.
   * @default false
   */
  captureStackTrace?: boolean;

  /**
   * Whether the span should be treated as the root span.
   * @default false
   */
  isRootSpan?: boolean;

  /** Additional attributes to annotate logs with. */
  annotateLogsWith?: Record<PropertyKey, unknown>;

  /**
   * The retry policy for failed operations.
   * @default Retry.noRetryPolicy
   */
  retryPolicy?: Schedule.Schedule<unknown>;

  /**
   * The kind of span (e.g., server, client).
   * @default 'server'
   */
  spanKind?: SpanKind;

  /**
   * Links to other spans.
   * @default []
   */
  spanLinks?: ReadonlyArray<SpanLink>;

  /**
   * The parent span to associate with this span.
   * @default undefined
   */
  spanParent?: AnySpan;

  /**
   * The type of span (e.g., web, db, cache, function, custom).
   * @default 'function'
   */
  spanType?: SpanType;
}>;

/**
 * Default values for instrumentation options.
 */
const defaultInstrumentationOptions = {
  isRootSpan: false,
  retryPolicy: Retry.noRetryPolicy,
  spanKind: 'server',
  spanType: 'function',
} as const satisfies InstrumentationOptions;

/**
 * Wraps an effect with instrumentation for tracing, logging, and retries.
 *
 * This function creates a span, annotates logs and spans, and applies a retry policy if specified.
 *
 * @param {string} spanName - The name of the span.
 * @param {InstrumentationOptions} [options] - Optional configuration for the span.
 *   If not provided, the default values will be used.
 * @returns A function that applies the instrumentation to an effect.
 *
 * @note Default `InstrumentationOptions`
 *  \```typescript
 * const defaultInstrumentationOptions = {
 *   isRootSpan: false,
 *   retryPolicy: Retry.noRetryPolicy,
 *   spanKind: 'server',
 *   spanType: 'function',
 * } as const satisfies InstrumentationOptions;
 * ``\`
 */
export const withInstrumentation =
  (
    spanName: string,
    options: InstrumentationOptions = defaultInstrumentationOptions,
  ) =>
  <Success, Failure, Requirements>(
    effect: Effect.Effect<Success, Failure, Requirements>,
  ) => {
    return Effect.gen(function* () {
      const opts = { ...defaultInstrumentationOptions, ...options };

      const currentSpan = yield* Effect.orElseSucceed(
        Effect.currentSpan,
        () => undefined,
      );

      const logAnnotations = Object.assign(
        {
          'dd.trace_id': currentSpan?.traceId,
          'dd.span_id': currentSpan?.spanId,
        },
        opts.annotateLogsWith,
        opts.annotateSpansWith,
      );

      return yield* effect.pipe(
        Effect.tapError((error) =>
          Effect.annotateCurrentSpan(
            isError(error)
              ? {
                  'error.name': error.name,
                  'error.stack': error.stack,
                  'error.message': error.message,
                  'error.cause': error.cause,
                }
              : flatten(error),
          ),
        ),
        Effect.retry(opts.retryPolicy),
        Effect.annotateLogs(logAnnotations),
        Effect.withSpan(spanName, {
          attributes: opts.attributes,
          kind: opts.spanKind,
          links: opts.spanLinks,
          parent: opts.spanParent,
          root: opts.isRootSpan,
        }),
        Effect.annotateSpans(opts.annotateSpansWith ?? {}),
      );
    });
  };
```

- `RedisMutex`
```typescript
import '@ungap/with-resolvers';
import { type LockLostCallback, Mutex } from 'redis-semaphore';
import { Data, Duration, Effect, Option } from 'effect';
import type { Redis as IoRedis } from 'ioredis';
import type { ParentSpan } from 'effect/Tracer';
import type { UnifyIntersection } from '@api/domains-prelude/src';
import { Redis } from './redis';
import { withInstrumentation } from '../core/with-instrumentation';

export class RedisMutexLockAcquisitionError extends Data.TaggedError(
  'RedisMutexLockAcquisitionError',
)<{ key: string; cause?: unknown }> {
  message =
    `An error occurred while attempting to acquire redis mutex ` +
    `lock with key '${this.key}'`;

  static withCause = ({ cause, key }: { key: string; cause: unknown }) => {
    if (cause instanceof this) {
      return cause;
    }

    return new this({ cause, key });
  };
}

export class RedisMutexLockLostError extends Data.TaggedError(
  'RedisMutexLockLostError',
)<{ key: string; cause?: unknown }> {
  message = `RedisMutex with key '${this.key}' failed due to a lock timeout`;

  static withCause = ({ cause, key }: { key: string; cause: unknown }) => {
    if (cause instanceof this) {
      return cause;
    }

    return new this({ cause, key });
  };
}

class MutexOptions extends Data.Class<{
  key: string;
  acquisitionTimeout?: Duration.DurationInput;
  maxAcquisitionAttempts?: number;
  refreshLockInterval?: Duration.DurationInput;
  lockTimeout?: Duration.DurationInput;
  retryAcquisitionInterval?: Duration.DurationInput;
}> {}

type Lock = Readonly<{
  key: string;
  lost: Promise<void>;
}>;

const Lock = {
  make: (key: string, lockLost: Promise<void>): Lock => ({
    key,
    lost: lockLost,
  }),
} as const;

type LockLostError = Parameters<LockLostCallback>[0];

type InternalMutexOptions = UnifyIntersection<
  Readonly<MutexOptions & { redisClient: IoRedis }>
>;

class InternalMutex {
  private lockLostResolver: PromiseWithResolvers<void>;
  private readonly mutex: Mutex;
  private readonly options: InternalMutexOptions;

  constructor(options: InternalMutexOptions) {
    this.lockLostResolver = Promise.withResolvers<void>();

    const onLockLost = async (cause: LockLostError) => {
      this.lockLostResolver.reject(cause);
      await this.releaseSafely();
    };

    this.mutex = new Mutex(options.redisClient, options.key, {
      acquireTimeout: toMillisOrUndefined(options.acquisitionTimeout),
      lockTimeout: toMillisOrUndefined(options.lockTimeout),
      acquireAttemptsLimit: options.maxAcquisitionAttempts,
      onLockLost,
      refreshInterval:
        options.refreshLockInterval === undefined
          ? toMillisOrUndefined(options.lockTimeout)
          : toMillisOrUndefined(options.refreshLockInterval),
      retryInterval: toMillisOrUndefined(options.retryAcquisitionInterval),
    });

    this.options = options;
  }

  private releaseSafely = async () => {
    try {
      this.mutex.stopRefresh();
      this.lockLostResolver = Promise.withResolvers<void>();
      return this.mutex.release();
    } catch (error) {
      console.error(
        `An unexpected error occurred while safely releasing mutex '${this.options.key}': ${JSON.stringify(error)}`,
      );
    }
  };

  acquire = async () => {
    try {
      const aquired = await this.mutex.tryAcquire();

      if (aquired === true) {
        return Lock.make(this.options.key, this.lockLostResolver.promise);
      }
      throw new RedisMutexLockAcquisitionError({ key: this.options.key });
    } catch (cause) {
      throw RedisMutexLockAcquisitionError.withCause({
        cause,
        key: this.options.key,
      });
    }
  };

  release = async () => {
    return this.releaseSafely();
  };
}

function toMillisOrUndefined(
  duration?: Duration.DurationInput,
): number | undefined {
  return Option.fromNullable(duration).pipe(
    Option.map(Duration.toMillis),
    Option.getOrUndefined,
  );
}

export class RedisMutex extends MutexOptions {
  constructor(key: string, options: Omit<MutexOptions, 'key'>) {
    super({ key, ...options });
  }

  readonly withLock = <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<
    A,
    RedisMutexLockAcquisitionError | RedisMutexLockLostError | E,
    Redis | Exclude<R, ParentSpan>
  > => {
    return Effect.gen(this, function* () {
      const key = this.key;
      const redis = yield* Redis;

      const mutex = new InternalMutex({
        key,
        redisClient: redis.service,
        acquisitionTimeout: this.acquisitionTimeout,
        lockTimeout: this.lockTimeout,
        maxAcquisitionAttempts: this.maxAcquisitionAttempts,
        refreshLockInterval: this.refreshLockInterval,
        retryAcquisitionInterval: this.retryAcquisitionInterval,
      });

      const acquire = Effect.tryPromise({
        async try() {
          return mutex.acquire();
        },
        catch(cause) {
          return RedisMutexLockAcquisitionError.withCause({ cause, key });
        },
      }).pipe(withInstrumentation('redis_mutex.with_lock.acquire'));

      const use = (lock: Lock) =>
        Effect.gen(function* () {
          const lockLost = Effect.tryPromise({
            async try() {
              return lock.lost.then(() =>
                Promise.reject(
                  `Lost lock promise resolved for RedisMutex with key '${key}'`,
                ),
              );
            },
            catch(cause) {
              return RedisMutexLockLostError.withCause({ cause, key });
            },
          });

          return yield* Effect.raceFirst(effect, lockLost);
        }).pipe(withInstrumentation('redis_mutex.with_lock.use'));

      const release = () =>
        Effect.promise(() => mutex.release()).pipe(
          withInstrumentation('redis_mutex.with_lock.release'),
        );

      return yield* Effect.acquireUseRelease(acquire, use, release);
    }).pipe(
      withInstrumentation('redis_mutex.with_lock', {
        annotateSpansWith: {
          'redis_mutex.key': this.key,
          'redis_mutex.acquisition_timeout': this.acquisitionTimeout,
          'redis_mutex.max_acquisition_attempts': this.maxAcquisitionAttempts,
          'redis_mutex.refresh_lock_interval': this.refreshLockInterval,
          'redis_mutex.lock_timeout': this.lockTimeout,
          'redis_mutex.retry_acquisition_interval':
            this.retryAcquisitionInterval,
        },
      }),
    );
  };
}
```
- `Retry`

```typescript
import { Schedule } from 'effect';
import type { Duration, DurationInput } from 'effect/Duration';

/**
 * Configuration options for exponential backoff retry strategy
 *
 * Defines the parameters for configuring a retry mechanism with exponential backoff
 *
 * @param {DurationInput} delay - Initial delay between retry attempts in milliseconds
 * @param {number} [growthFactor] - Factor by which the delay increases exponentially
 * @param {boolean} [jitter] - Whether to add randomness to the retry delay to prevent thundering herd problem
 * @param {number} [maxRetries] - Maximum number of retry attempts
 */
export type ExponentialBackoffOptions = Readonly<{
  /**
   * Initial delay between retry attempts
   * @default 100
   */
  delay: DurationInput;

  /**
   * Factor by which the delay increases exponentially
   * @default 2.0
   */
  growthFactor?: number;

  /**
   * Whether to add randomness to the retry delay to prevent thundering herd problem
   * @default true
   */
  jitter?: boolean;

  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;
}>;

/**
 * Default configuration for exponential backoff retry strategy
 *
 * Provides out-of-the-box configuration for retry mechanism
 */
const defaultExponentialBackoffOptions = {
  delay: 100,
  growthFactor: 2.0,
  jitter: true,
  maxRetries: 3,
} as const satisfies ExponentialBackoffOptions;

/**
 * Creates an exponential backoff retry policy with configurable options
 *
 * @param {ExponentialBackoffOptions} [options] - Optional configuration to override defaults
 * @returns {Schedule.Schedule} A retry schedule with exponential backoff and optional jitter
 *
 * @example
 * // Create a custom retry policy with longer delays and more retries
 * const customPolicy = makeExponentialBackoffPolicy({
 *   delay: 500,
 *   maxRetries: 5,
 *   jitter: false
 * });
 */
const makeExponentialBackoffPolicy = (
  options?: ExponentialBackoffOptions,
): Schedule.Schedule<[Duration, number]> => {
  const opts = { ...defaultExponentialBackoffOptions, ...options };

  const retryPolicy = Schedule.intersect(
    Schedule.exponential(opts.delay, opts.growthFactor),
    Schedule.recurs(opts.maxRetries),
  ).pipe((policy) => (opts.jitter ? Schedule.jittered(policy) : policy));

  return retryPolicy;
};

/**
 * Default exponential backoff retry policy
 *
 * Provides a pre-configured retry policy with standard exponential backoff settings
 */
const defaultExponentialBackoffPolicy = makeExponentialBackoffPolicy(
  defaultExponentialBackoffOptions,
);

/**
 * Retry utility with exponential backoff policy generation
 *
 * Provides methods for creating and managing retry policies
 */
export const Retry = {
  /**
   * Creates a custom exponential backoff retry policy
   *
   * @param {ExponentialBackoffOptions} [options] - Configuration for the retry policy
   * @returns {Schedule} A customized retry schedule
   */
  makeExponentialBackoffPolicy,

  /**
   * Default exponential backoff retry policy
   *
   * Ready-to-use retry policy with standard configuration
   */
  exponentialBackoffPolicy: defaultExponentialBackoffPolicy,

  /**
   * Default no retry policy
   */
  noRetryPolicy: Schedule.stop,

  /**
   * Default retry once policy
   */
  once: Schedule.once,
};
```

- `Pino Logger + DataDog`
```typescript
import {
  Array as Arr,
  Cause,
  FiberId,
  HashMap,
  Inspectable,
  List,
  Logger as EffectLogger,
  type LogLevel,
  Effect,
} from 'effect';
import { isObject, isString } from 'effect/Predicate';
import pino, { type LogFn } from 'pino';

const logger = pino({
  formatters: {
    level: (label) => ({ level: label }),
  },
});

const pinoLogger = EffectLogger.make(
  ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
    const now = date.getTime();
    const annotationsRecord: Record<string, unknown> = {};
    const spansRecord: Record<string, number> = {};

    if (HashMap.size(annotations) > 0) {
      for (const [k, v] of annotations) {
        annotationsRecord[k] = structuredMessage(v);
      }
    }

    if (List.isCons(spans)) {
      for (const span of spans) {
        spansRecord[span.label] = now - span.startTime;
      }
    }

    const logRecord = {
      ...annotationsRecord,
      ...spansRecord,
      level: logLevel.label,
      timestamp: date.toISOString(),
      cause: Cause.isEmpty(cause)
        ? undefined
        : Cause.pretty(cause, { renderErrorCause: true }),
      fiberId: FiberId.threadName(fiberId),
    };

    const log = getLogFn(logLevel);

    const messages = Arr.ensure(message);

    const [firstMessage, secondMessage] = messages;

    if (
      isObject(firstMessage) &&
      (isString(secondMessage) || secondMessage === undefined)
    ) {
      if ('msg' in firstMessage) {
        const message = firstMessage.msg;
        delete firstMessage.msg;
        // @ts-expect-error it's safe to remap this
        firstMessage.message = message;
        return log({ ...logRecord, ...firstMessage }, secondMessage);
      }

      return log(
        { ...logRecord, message: structuredMessage(firstMessage) },
        secondMessage,
      );
    }

    if (isString(firstMessage)) {
      const [_, , ...args] = messages;
      return log(logRecord, firstMessage, ...args);
    }

    return log({ ...logRecord, message: structuredMessage(message) });
  },
);

function getLogFn(logLevel: LogLevel.LogLevel): LogFn {
  switch (logLevel._tag) {
    case 'All': {
      return logger.info.bind(logger);
    }
    case 'Fatal': {
      return logger.fatal.bind(logger);
    }
    case 'Error': {
      return logger.error.bind(logger);
    }
    case 'Warning': {
      return logger.warn.bind(logger);
    }
    case 'Info': {
      return logger.info.bind(logger);
    }
    case 'Debug': {
      return logger.debug.bind(logger);
    }
    case 'Trace': {
      return logger.trace.bind(logger);
    }
    case 'None': {
      return () => {};
    }
  }
}

const structuredMessage = (u: unknown): unknown => {
  switch (typeof u) {
    case 'bigint':
    case 'function':
    case 'symbol': {
      return String(u);
    }
    default: {
      return Inspectable.toJSON(u);
    }
  }
};

const PinoLogger = EffectLogger.replace(EffectLogger.defaultLogger, pinoLogger);

export const Logger = {
  PinoLogger,
  flush: () => Effect.succeed(logger.flush()),
} as const;
```

# Case Study | Domains Search/Buy
- Will built fully on Effect
  - Additionally will power registrar services, e.g. renewals, transfers, team moves, pricing, further tld management etc 
- Aiming to be the fastest domain search/buy experience on the web
  - Fill the gap that google domains left



# Takeaways & the future 
## Positive Takeaways
- Answers to the most common problems we have at Vercel
  - Standardization
  - Dependency management
  - Error Handling
  - Retries
  - Consistency
- Once the foundational primitives are built it's like building with legos and
you are often faster
- Easier to maintain and refactor (reference MarkPrompt podcast)
  - Theory that it may unintuitevly be easier to onboard devs due to guard rails
- OTEL integration is amazing


## Challenges
- DataDog & Tracing Integration w/ existing code
- Http w/ Vercel's internal webframework built on Micro
- "Low Level" Apis & Large Api surface
  - Often needed to consult the Effect team in Discord
- AI knowledge of Effect is lacking and solutions like 
  - API docs + repo exceed most context windows

## Looking to the future
- Recap Search/Buy (hope to talk w/ Johannes after release)
- Exploring Effect Cluster for Domain & Cert Renewals
- Hoping to start internal lunch & learns and advocating more broadly for adoption


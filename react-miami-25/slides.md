
# Ideas/Outline

- Title
- Second slide show an error boundary with a generic error as a joke 
- Outline
- The Problem With TypeScript
   - Copy joke from Effect Days talk
   - Happy Path Slides
   - Untyped Errors
- Use similar example as Effect Days talk for all the things that can go wrong in a simply typescript function
   - Use Rhys meme slide(s)
- Power of an Error example
- Two kinds of Errors
  - Known Errors
  - Defects
- Intro to result type & errors as values
   - Possible comparison w/ Rust, Go, etc
   - Ok | Error
   - Discriminated Union
   - Promise.allSettled
   - React Query + SWR (const { data, error} = ...)
     - Show the problem with the error generics (i.e. the error type is not tracked)
     - "We'll go over how to solve this problem later"
   - .map, .andThen, unwrap
   - neverthrow
- Error Boundaries
   - Reserve for Defects
   - Tagged Error + Match on ._tag
   - Wix Engineering Error Message
- Demonstrate Examples
   - ServerActions
   - FormActions
   - BusinessLogic/Utils
   - ReactQuery/SWR

## Result type
TODO: Refactor to full renew domain flow and transition from one style to the next iteratively

### Ok | Error
```typescript
declare function renewDomain(domainName: string): Domain | Error

const renewDomainResult =  use(renewDomain("todo-joke.com"))

if (Error.isError(renewDomainResult)) {
  return <ErrorMessage message={renewDomainResult.message} />
}

return <RenewedDomain domain={renewDomainResult} />
```

```typescript
### PromiseSettledResult
```typescript
// Consider Showing a better version of PromiseSettledResult
interface PromiseFulfilledResult<T> {
    status: "fulfilled";
    value: T;
}

interface PromiseRejectedResult {
    status: "rejected";
    reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

declare function renewDomain<Ok>(domainName: string): PromiseSettledResult<Ok>

# option #1
const [renewDomainResult] =  use(Promise.allSettled([renewDomain("todo-joke.com")]))

if (renewDomainResult.status === "rejected") {
  return <ErrorMessage message={renewDomainResult.reason as string} /> 😱 
}

return <RenewedDomain domain={renewDomainResult.value} />


# option #2
// TODO: implement cache to create stable references
function useSettledPromise<Success>(promise: Promise<Success>): PromiseSettledResult<Success> {
 const [result] = use(Promise.allSettled([promise]))
 return result;
}


const renewDomainResult =  useSettledPromise(renewDomain("todo-joke.com"))


if (renewDomainResult.status === "rejected") {
  return <ErrorMessage message={renewDomainResult.reason as string} /> 😱 
}

return <RenewedDomain domain={renewDomainResult.value} />
```

### Discriminated Union
```typescript
type Result<Success, Failure> = { _tag: 'ok', value: Success } | { _tag: 'err', error: Failure} 

declare function renewDomain(domainName: string): Result<Domain, string>

const renewDomainResult =  use(renewDomain("todo-joke.com"))

if (renewDomainResult._tag === "err") {
  return <FailureorMessage message={renewDomainResult.error} />
}

return <RenewedDomain domain={renewDomainResult.value} />

### Result Type

```typescript
type Result<Success, Failure> = Ok<Success> | Err<Failure>

interface Result<Success, Failure> {
	map<NextSuccess>(
		fn: (value: Success) => NextSuccess,
	): Result<NextSuccess, Failure>;

	andThen<NextSuccess, NextFailure = Failure>(
		fn: (value: Success) => Result<NextSuccess, NextFailure>,
	): Result<NextSuccess, Failure | NextFailure>;

    unwrap(message?: string): Success
}
```



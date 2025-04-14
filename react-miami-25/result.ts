export type Result<A, E> = Ok<A> | Err<E>;

export const Result = {
	ok<A>(value: A): Ok<A> {
		return new Ok(value);
	},

	err<E>(value: E): Err<E> {
		return new Err(value);
	},

	isOk<A, E>(result: Result<A, E>): result is Ok<A> {
		if (result._tag === "ok") {
			return true;
		}
		return false;
	},

	isErr<A, E>(result: Result<A, E>): result is Err<E> {
		if (result._tag === "err") {
			return true;
		}
		return false;
	},

	try<A>(
		fn: () => A | Promise<A>,
	): Result<A, Error> | Promise<Result<A, Error>> {
		try {
			const result = fn();

			if (result instanceof Promise) {
				return result.then(Result.ok);
			}

			return Result.ok(result);
		} catch (error) {
			return Result.err(new Error("TryCatchError", { cause: error }));
		}
	},
};

class Ok<A> {
	readonly _tag = "ok" as const;

	private readonly value: A;

	constructor(value: A) {
		this.value = value;
	}

	map<B>(fn: (value: A) => B): Ok<B> {
		return Result.ok(fn(this.value));
	}

	mapError<F>(_fn: (value: never) => F): Ok<A> {
		return this;
	}

	andThen<B, E>(fn: (value: A) => Result<B, E>): Result<B, E> {
		return fn(this.value);
	}

	unwrap(_message?: string): A {
		return this.value;
	}

	unwrapOr<B>(_or: B): A {
		return this.value;
	}
}

class Err<E> {
	readonly _tag = "err" as const;
	private readonly value: E;

	constructor(value: E) {
		this.value = value;
	}

	map<B>(_fn: (value: never) => B): Err<E> {
		return this;
	}

	mapError<F>(fn: (value: E) => F): Err<F> {
		return Result.err(fn(this.value));
	}

	andThen<B, F>(_fn: (value: never) => Result<B, F>): Err<E> {
		return this;
	}

	unwrap(message?: string): never {
		throw new Error(message ?? `Result is error: ${this.value}`);
	}

	unwrapOr<B>(or: B): B {
		return or;
	}
}

//interface Result<Success, Failure> {
//	map<NextSuccess>(
//		fn: (value: Success) => NextSuccess,
//	): Result<NextSuccess, Failure>;
//
//	andThen<NextSuccess, NextFailure = Failure>(
//		fn: (value: Success) => Result<NextSuccess, NextFailure>,
//	): Result<NextSuccess, Failure | NextFailure>;
//
//	unwrap(message?: string): Success;
//}
//
//declare const r: _Result<number, number>;
//
//const r2 = r
//	.andThen((num) => num as unknown as _Result<string, boolean>)
//	.map((str) => true);

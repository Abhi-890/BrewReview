import Review from "../../../../../lib/models/reviewModel";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/connection";
import { getDataFromToken } from "../../../../utils/getDataFromToken";

connectToDB();

export async function GET(request) {
  try {
    const reviews = await Review.find();

    return NextResponse.json({
      message: "reviews fetched successfully",
      success: true,
      data: reviews,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

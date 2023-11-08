import Review from "../../../../../lib/models/reviewModel";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "../../../../../lib/connection";
import { getDataFromToken } from "../../../../utils/getDataFromToken";

connectToDB();

export async function POST(request) {
  try {
    console.log(request);
    const reqBody = await request.json();
    const temp = await getDataFromToken(request);
    const { brewery, rating, description } = reqBody;
    const newReview = new Review({
      userId: temp.id,
      username: temp.username,
      brewery,
      rating,
      description,
    });
    const savedReview = await newReview.save();
    console.log(savedReview);

    return NextResponse.json({
      message: "review Created Successfully",
      success: true,
      savedReview,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
